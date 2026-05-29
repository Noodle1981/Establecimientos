# Informe de Auditoría y Plan de Mejoras para Producción

> **Proyecto:** Establecimientos Educativos — Ministerio de Educación San Juan
> **Fecha:** 2026-05-29
> **Auditor:** Antigravity AI
> **Branch analizado:** `feature/refactor-gral`

---

## Resumen Ejecutivo

| Área                        | Estado           | Críticos | Medios | Bajos |
|------                       |----------------  |----------|--------|-------|
| Seguridad Backend           | 🔴 Atención      | 3        | 2      | 2     |
| Concurrencia SQLite         | 🟡 Mejorable     | 0        | 3      | 2     |
| Rendimiento Inertia/React   | 🟡 Mejorable     | 0        | 4      | 3     |
| Reportes DOMPDF             | 🟡 Mejorable     | 0        | 2      | 1     |
| Calidad de Código           | 🟡 Mejorable     | 0        | 3      | 3     |

---

## 1. Auditoría de Seguridad

### 🔴 CRÍTICO-1 — Contraseña temporal hardcodeada en código fuente

**Archivo:** `app/Http/Controllers/Admin/AdminController.php` — método `resetPassword()`

```php
// ACTUAL (VULNERABLE)
$tempPass = 'Educacion2026!';
```

**Riesgo:** Cualquier persona con acceso al repositorio (GitHub) conoce la contraseña de reset.
Si el repo es público o se filtra, **todos los usuarios reseteados quedan expuestos**.

**Corrección:**

```php
use Illuminate\Support\Str;

public function resetPassword(Request $request, $id, ActivityLogService $logger)
{
    $user = User::findOrFail($id);

    // Generar contraseña aleatoria segura de 12 caracteres
    $tempPass = Str::password(12, letters: true, numbers: true, symbols: false);

    $user->update([
        'password'            => Hash::make($tempPass),
        'password_changed_at' => null,
    ]);

    $logger->logUpdate($user, "Blanqueó la contraseña", ['after' => ['password' => 'TEMPORAL_GENERADA']]);

    return back()->with('success', "Contraseña temporal generada: {$tempPass}");
}
```

---

### 🔴 CRÍTICO-2 — Ruta pública `/reportes` sin rate limiting

**Archivo:** `routes/web.php`

```php
// ACTUAL (VULNERABLE)
Route::post('/reportes', [App\Http\Controllers\Publico\ReporteController::class, 'store'])
    ->name('publico.reportes.store');
```

**Riesgo:** Un atacante puede spamear miles de reportes, llenando la BD y el panel de administración.

**Corrección:**

```php
// CORRECTO — 5 envíos por minuto por IP
Route::post('/reportes', [App\Http\Controllers\Publico\ReporteController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('publico.reportes.store');
```

Además, reforzar el Form Request con honeypot y validación de tipo:

```php
// app/Http/Requests/Publico/StoreReporteRequest.php
public function rules(): array
{
    return [
        'honeypot'         => 'max:0',   // campo oculto anti-bot, debe estar vacío
        'edificio_id'      => 'nullable|exists:edificios,id',
        'tipo'             => 'required|in:ERROR_DATOS,UBICACION_INCORRECTA,INFO_FALTANTE,OTRO',
        'descripcion'      => 'required|string|min:10|max:1000',
        'nombre_remitente' => 'nullable|string|max:100',
        'email_remitente'  => 'nullable|email|max:150',
    ];
}
```

---

### 🔴 CRÍTICO-3 — PDFController sin rutas registradas

`app/Http/Controllers/Admin/PDFController.php` tiene los métodos `downloadIndividual($id)` y
`downloadGeneral()` pero **no aparecen en `web.php` ni en `auth.php`**. Esto los deja
inaccesibles o, si se agregan rutas en el futuro sin middleware, desprotegidos.

**Corrección — registrar dentro del grupo protegido:**

```php
// routes/web.php — dentro de middleware(['role:admin,administrativos'])
Route::prefix('administrativos')->group(function () {
    // ... rutas existentes ...
    Route::get('/auditoria/{id}/pdf',
        [App\Http\Controllers\Admin\PDFController::class, 'downloadIndividual'])
        ->name('administrativos.auditoria.pdf.individual');

    Route::get('/auditoria/pdf/general',
        [App\Http\Controllers\Admin\PDFController::class, 'downloadGeneral'])
        ->name('administrativos.auditoria.pdf.general');
});
```

---

### 🟡 MEDIO-1 — `authorize()` excluye al rol `admin` en todos los Form Requests

**Afecta:** Todos los archivos en `app/Http/Requests/Administrativos/`

```php
// ACTUAL — el admin recibe 403 al intentar crear/editar
public function authorize(): bool
{
    return $this->user()->isAdministrativo();
}
```

**Corrección (si el admin debe poder operar):**

```php
public function authorize(): bool
{
    return $this->user()->hasRole(['admin', 'administrativos']);
}
```

---

### 🟡 MEDIO-2 — `campos_auditados` sin validación de estructura interna

**Archivo:** `app/Http/Requests/Administrativos/UpdateAuditoriaRequest.php`

```php
// ACTUAL — acepta cualquier clave en el JSON
'campos_auditados' => 'nullable|array',
```

**Corrección — whitelist de claves permitidas:**

```php
'campos_auditados'   => 'nullable|array',
'campos_auditados.*' => 'string|in:nombre,cue,nivel_educativo,ambito,radio,categoria,direccion_area,sector,zona,observaciones',
```

---

### 🟢 BAJO-1 — Verificar registro del middleware `RequirePasswordChange`

Confirmar en `bootstrap/app.php` que el middleware está registrado. Si no lo está,
la obligación de cambiar contraseña al primer login **no tiene efecto**:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
        \App\Http\Middleware\RequirePasswordChange::class, // ← verificar
    ]);
})
```

---

### 🟢 BAJO-2 — `role` expuesto en cada respuesta Inertia (HandleInertiaRequests)

El rol se usa para condicionar la UI del frontend (aceptable). Verificar que **ningún**
componente React use el `role` del prop compartido como control de acceso real —
toda autorización debe ocurrir en el backend (policies + middleware). ✅ Actualmente parece correcto.

---

## 2. Optimización y Concurrencia (SQLite)

### 🟡 MEDIO-1 — Riesgo de "Database is locked" bajo concurrencia

SQLite usa bloqueo exclusivo a nivel de archivo en escrituras. Con múltiples usuarios
admin operando simultáneamente puede producirse el error.

**Corrección — activar WAL mode en `AppServiceProvider::boot()`:**

```php
use Illuminate\Support\Facades\DB;

public function boot(): void
{
    if (config('database.default') === 'sqlite') {
        DB::statement('PRAGMA journal_mode=WAL;');     // lecturas concurrentes con escrituras
        DB::statement('PRAGMA synchronous=NORMAL;');   // balance seguridad/velocidad
        DB::statement('PRAGMA busy_timeout=5000;');    // 5s antes de lanzar error
        DB::statement('PRAGMA cache_size=-64000;');    // 64MB caché de páginas en RAM
    }
    // ...
}
```

---

### 🟡 MEDIO-2 — `MapaController::index()` carga colección completa antes de cachear

```php
// ACTUAL — pico de RAM en cada cache miss
Cache::remember('public-mapa-edificios-react', 3600, function () {
    return Edificio::with('establecimientos.modalidades')
        ->whereNotNull('latitud')
        ->get(); // colección completa en RAM
});
```

**Corrección — chunk + proyección de columnas:**

```php
Cache::remember('public-mapa-edificios-react', 3600, function () {
    $result = [];
    Edificio::with([
        'establecimientos:id,edificio_id,cue,nombre',
        'establecimientos.modalidades:id,establecimiento_id,nivel_educativo,direccion_area,radio,categoria,ambito',
    ])
    ->select('id','cui','calle','numero_puerta','localidad','latitud','longitud','zona_departamento','ambito','sector')
    ->whereNotNull('latitud')->whereNotNull('longitud')
    ->whereHas('establecimientos.modalidades')
    ->chunk(200, function ($edificios) use (&$result) {
        foreach ($edificios as $e) {
            $result[] = $e->toArray();
        }
    });
    return $result;
});
```

---

### 🟡 MEDIO-3 — Índice faltante en `users.role`

El dashboard ejecuta `User::where('role', 'admin')->count()` (y otras variantes) sin índice.

**Corrección — nueva migración:**

```php
Schema::table('users', function (Blueprint $table) {
    $table->index('role');
});
```

---

### 🟢 BAJO-1 — `AuditoriaController::updateEstado()` sin try/catch

Si falla la propagación a vinculados, la transacción revierte sin mensaje claro al usuario.

```php
// Corrección
try {
    DB::transaction(function () use ($request, $modalidad) {
        $modalidad->cambiarEstado(/* ... */);
        // propagación...
    });
    return back()->with('success', 'Estado actualizado correctamente.');
} catch (\Throwable $e) {
    report($e);
    return back()->with('error', 'Error al actualizar el estado. Intente nuevamente.');
}
```

---

### 🟢 BAJO-2 — `UpdateModalidadAction` no registra ActivityLog

A diferencia de Store y Delete, el Update no deja trazabilidad.

```php
// Agregar al final de UpdateModalidadAction::execute()
$logger->logUpdate($modalidad, "Actualizó modalidad CUE: {$establecimiento->cue}");
```

---

## 3. Rendimiento en la Capa Inertia.js 2.x y React

### 🟡 MEDIO-1 — `MapaController` no usa Lazy Props

Todos los datos del mapa se cargan sincrónicamente en cada visita, aumentando el TTFB.

**Corrección:**

```php
// app/Http/Controllers/Publico/MapaController.php
return Inertia::render('Publico/MapaPublico', [
    'edificios' => Inertia::lazy(fn () =>
        Cache::remember('public-mapa-edificios-react', 3600,
            fn () => $this->buildEdificiosData()
        )
    ),
]);
```

En React, cargar la prop al montar con `router.reload({ only: ['edificios'] })`.

---

### 🟡 MEDIO-2 — Funciones inline sin `useCallback` en `MapaPublico.jsx`

Las funciones pasadas como props a `MapView` se recrean en cada render.

```jsx
// Corrección — envolver con useCallback
const handleSetSelectedEdificio = useCallback((edificio) => {
    setSelectedEdificio(edificio);
}, []);

const handleSetHoveredEdificioId = useCallback((id) => {
    setHoveredEdificioId(id);
}, []);
```

---

### 🟡 MEDIO-3 — `DashboardController` ejecuta 6 caches independientes secuenciales

Unificar en una única clave de caché reduce el overhead de serialización/deserialización:

```php
$allData = Cache::remember("dashboard_all_{$cacheKey}", 300, function () use (...) {
    return [
        'modalidades' => $this->getModalidadesData(...),
        'categorias'  => $this->getCategoriasData(...),
        'zonas'       => $this->getZonasData(...),
        'radios'      => $this->getRadiosData(...),
        'ambito'      => $this->getAmbitoData(...),
    ];
});
```

---

### 🟡 MEDIO-4 — `ReporteController::index()` sin paginación

```php
// ACTUAL — carga todos los reportes
->get();

// CORRECCIÓN
->paginate(25);
```

---

### 🟢 BAJO-1 — `SchoolCard` no está memoizado

```jsx
const SchoolCard = React.memo(function SchoolCard({ edificio, onClose }) {
    // ...
});
```

---

### 🟢 BAJO-2 — Optimización selectiva de columnas en eager loads del mapa API

`EdificiosMapaController` debería usar `select()` explícito para evitar transferir
columnas innecesarias (ej. `observaciones`, `te_voip`) al JSON público del mapa.

---

### 🟢 BAJO-3 — Vite prefetch en rutas donde no se usa el mapa

`Vite::prefetch(3)` global puede precargar el chunk pesado de Leaflet en rutas
que no usan el mapa. Evaluar aplicarlo solo en el layout del mapa público.

---

## 4. Robustez en Reportes (DOMPDF)

### 🟡 MEDIO-1 — `downloadGeneral()` carga toda la colección en RAM

```php
// ACTUAL
$auditorias = $query->get(); // puede fallar con >500 registros
```

**Corrección:**

```php
public function downloadGeneral(Request $request)
{
    ini_set('memory_limit', '256M');
    set_time_limit(120);

    $request->validate([
        'date_from' => 'nullable|date',
        'date_to'   => 'nullable|date|after_or_equal:date_from',
    ]);

    // Agrupar en chunks de 50 para el template Blade
    $chunks = AuditoriaEduge::with(['establecimiento', 'user'])
        ->latest('fecha_visita')
        ->when($request->date_from, fn($q) => $q->where('fecha_visita', '>=', $request->date_from))
        ->when($request->date_to,   fn($q) => $q->where('fecha_visita', '<=', $request->date_to))
        ->get()   // DOMPDF necesita la colección completa para paginar en Blade
        ->chunk(50);

    $pdf = Pdf::loadView('pdf.auditoria-general', [
        'chunks'   => $chunks,
        'dateFrom' => $request->date_from,
        'dateTo'   => $request->date_to,
    ])->setPaper('A4', 'landscape');

    return $pdf->download('informe_general_auditorias.pdf');
}
```

---

### 🟡 MEDIO-2 — Estilos CSS potencialmente incompatibles con DOMPDF

DOMPDF soporta un subconjunto limitado de CSS. Verificar en las vistas Blade de PDF:

```css
/* ✅ Compatible */
@page { margin: 15mm; size: A4 landscape; }
body  { font-family: DejaVu Sans, sans-serif; font-size: 9px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 4px 6px; }
.page-break { page-break-after: always; }

/* ❌ Evitar en DOMPDF */
/* flexbox, CSS grid, position:sticky, box-shadow, opacity en gradients */
```

La fuente **DejaVu Sans** es la más compatible con DOMPDF para caracteres especiales (tildes, ñ).

---

### 🟢 BAJO-1 — Sin validación de fechas en `downloadGeneral`

```php
// Agregar al inicio del método
$request->validate([
    'date_from' => 'nullable|date',
    'date_to'   => 'nullable|date|after_or_equal:date_from',
]);
```

---

## 5. Estrategia de Testing (QA — Pest)

### 5.1 Tests de Seguridad y Roles

```php
// tests/Feature/Security/ReporteRateLimitTest.php
it('bloquea más de 5 reportes por minuto desde la misma IP', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post('/reportes', [
            'tipo'        => 'OTRO',
            'descripcion' => 'Reporte de prueba ' . $i,
        ])->assertRedirect();
    }
    $this->post('/reportes', [
        'tipo'        => 'OTRO',
        'descripcion' => 'Reporte overflow',
    ])->assertStatus(429);
});

// tests/Feature/Security/RoleAccessTest.php
it('usuario sin rol no accede a rutas administrativas', function () {
    $this->actingAs(User::factory()->create(['role' => 'user']))
         ->get('/administrativos/Panel')
         ->assertStatus(403);
});

it('administrativo no accede a rutas solo admin', function () {
    $this->actingAs(User::factory()->create(['role' => 'administrativos']))
         ->get('/admin/users')
         ->assertStatus(403);
});
```

### 5.2 Tests de Integración — Mapa (assertInertia)

```php
// tests/Feature/Publico/MapaPublicoTest.php
it('el mapa recibe la estructura correcta de edificios', function () {
    Edificio::factory()
        ->has(Establecimiento::factory()
            ->has(Modalidad::factory(), 'modalidades'), 'establecimientos')
        ->create(['latitud' => -31.5, 'longitud' => -68.5]);

    $this->get('/mapa')
         ->assertInertia(fn ($page) => $page
             ->component('Publico/MapaPublico')
             ->has('edificios')
             ->has('edificios.0', fn ($e) => $e
                 ->has('id')
                 ->has('latitud')
                 ->has('longitud')
                 ->has('ambito')
                 ->has('establecimientos')
                 ->has('establecimientos.0.modalidades')
             )
         );
});
```

### 5.3 Tests de CRUD — Edificios

```php
// tests/Feature/Administrativos/EdificioControllerTest.php
it('un administrativo puede crear un edificio válido', function () {
    $this->actingAs(User::factory()->create(['role' => 'administrativos']))
         ->post('/administrativos/edificios', [
             'cui'       => '1234567',
             'calle'     => 'Av. Libertador',
             'localidad' => 'Capital',
             'latitud'   => -31.5,
             'longitud'  => -68.5,
         ])->assertRedirect();

    $this->assertDatabaseHas('edificios', ['cui' => '1234567']);
});

it('no se puede crear un edificio con CUI duplicado', function () {
    Edificio::factory()->create(['cui' => '1234567']);

    $this->actingAs(User::factory()->create(['role' => 'administrativos']))
         ->post('/administrativos/edificios', [
             'cui'       => '1234567',
             'calle'     => 'Otra Calle',
             'localidad' => 'Capital',
         ])->assertSessionHasErrors('cui');
});
```

### 5.4 Tests de PDF

```php
// tests/Feature/Admin/PDFControllerTest.php
it('genera un PDF individual sin errores', function () {
    $auditoria = AuditoriaEduge::factory()->create();

    $this->actingAs(User::factory()->create(['role' => 'admin']))
         ->get("/administrativos/auditoria/{$auditoria->id}/pdf")
         ->assertStatus(200)
         ->assertHeader('content-type', 'application/pdf');
});

it('genera un PDF general con filtro de fechas', function () {
    AuditoriaEduge::factory(10)->create(['fecha_visita' => '2026-01-15']);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
         ->get('/administrativos/auditoria/pdf/general?date_from=2026-01-01&date_to=2026-01-31')
         ->assertStatus(200)
         ->assertHeader('content-type', 'application/pdf');
});
```

---

## Checklist de Implementación Priorizada

| #  | Tarea                                                    | Archivo                     | Prioridad                   | Complejidad  |
|--- |----------------------------------------------------------|-----------------------------|-----------------------------|--------------|
| 1  | Contraseña temporal con `Str::password()`                | `AdminController.php`       | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 2  | Rate limiting `throttle:5,1` en `POST /reportes`         | `web.php`                   | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 3  | Registrar rutas de `PDFController` en grupo protegido    | `web.php`                   | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 4  | PRAGMA WAL mode en SQLite                                | `AppServiceProvider.php`    | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 5  | try/catch en `updateEstado()`                            | `AuditoriaController.php`   | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 6  | Paginación en `ReporteController::index()`               | `ReporteController.php`     | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 7  | Validar `campos_auditados.*` con whitelist               | `UpdateAuditoriaRequest.php`| ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 8  | Validar rango de fechas en `downloadGeneral()`           | `PDFController.php`         | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 9  | `authorize()` incluir rol `admin` en Form Requests       | `Requests/Administrativos/` | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 10 | Cache unificada en `DashboardController`                 | `DashboardController.php`   | ✅ IMPLEMENTADO - CORREGIDO | Media        |
| 11 | `chunk()` en build de caché del mapa                     | `MapaController.php`        | ✅ IMPLEMENTADO - CORREGIDO | Media        |
| 12 | Lazy Props para datos del mapa en Inertia                | `MapaController.php`        | ✅ IMPLEMENTADO - CORREGIDO | Media        |
| 13 | `useCallback` en handlers de `MapaPublico.jsx`           | `MapaPublico.jsx`           | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 14 | `ini_set memory_limit` + `set_time_limit` en PDF general | `PDFController.php`         | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 15 | Fuente DejaVu Sans en vistas Blade PDF                   | `pdf/*.blade.php`           | ✅ IMPLEMENTADO - CORREGIDO | Baja         |
| 16 | Índice `role` en tabla `users`                           | Nueva migración             | 🟢 Baja                     | Baja         |
| 17 | `React.memo` en `SchoolCard`                             | `MapView.jsx`               | 🟢 Baja                     | Baja         |
| 18 | ActivityLog en `UpdateModalidadAction`                   | `UpdateModalidadAction.php` | 🟢 Baja                     | Baja         |
| 19 | Tests de seguridad y roles (Pest)                        | `tests/Feature/`            | 🟢 Baja                     | Media        |
| 20 | Tests de integración mapa (assertInertia)                | `tests/Feature/Publico/`    | 🟢 Baja                     | Media        |
