# Arquitectura del Laravel Boilerplate Starter Kit

Este documento describe la arquitectura y estructura del boilerplate.

## Stack Tecnológico

### Backend
- **Laravel 12.x** - Framework PHP
- **PHP 8.2+** - Lenguaje de programación
- **MySQL/PostgreSQL/SQLite** - Base de datos

### Frontend
- **Livewire 3** - Framework reactivo para Laravel
- **Alpine.js** - Framework JS minimalista (incluido con Livewire)
- **Tailwind CSS 3** - Framework CSS utility-first

### Testing
- **PHPUnit** - Framework de testing para PHP
- **Laravel Testing Utilities** - Helpers para testing

### Autenticación
- **Laravel Breeze** - Starter kit de autenticación con Livewire

## Estructura del Proyecto

```
base_laravel/
├── app/
│   ├── Http/
│   │   ├── Middleware/
│   │   │   └── CheckRole.php              # Middleware de roles
│   │   └── Controllers/
│   ├── Livewire/
│   │   ├── Admin/
│   │   │   └── AdminDashboard.php         # Componente dashboard admin
│   │   ├── Mid/
│   │   │   └── MidDashboard.php           # Componente dashboard mid
│   │   └── User/
│   │       └── UserDashboard.php          # Componente dashboard user
│   └── Models/
│       └── User.php                        # Modelo con roles y helpers
│
├── bootstrap/
│   └── app.php                             # Registro de middleware
│
├── database/
│   ├── factories/
│   │   └── UserFactory.php                 # Factory con soporte de roles
│   ├── migrations/
│   │   └── *_add_role_to_users_table.php   # Migración de roles
│   └── seeders/
│       ├── DatabaseSeeder.php              # Seeder principal
│       └── RoleUsersSeeder.php             # Seeder de usuarios de prueba
│
├── resources/
│   ├── css/
│   │   └── app.css                         # Estilos Tailwind
│   ├── js/
│   │   └── app.js                          # JavaScript y Livewire
│   └── views/
│       ├── components/
│       │   └── layouts/
│       │       └── app.blade.php           # Layout base
│       ├── layouts/
│       │   ├── app.blade.php               # Layout de aplicación
│       │   └── guest.blade.php             # Layout para invitados
│       ├── livewire/
│       │   ├── admin/
│       │   │   └── admin-dashboard.blade.php
│       │   ├── mid/
│       │   │   └── mid-dashboard.blade.php
│       │   └── user/
│       │       └── user-dashboard.blade.php
│       └── welcome.blade.php               # Página de inicio
│
├── routes/
│   └── web.php                             # Rutas con middleware de roles
│
├── tests/
│   └── Feature/
│       └── RoleAuthorizationTest.php       # Tests de autorización
│
├── .agent/
│   └── workflows/
│       └── context.md                      # Contexto para IA
│
└── doc/
    ├── architecture.md                     # Este documento
    ├── setup.md                            # Guía de instalación
    ├── roles-system.md                     # Sistema de roles
    └── testing-guide.md                    # Guía de testing
```

## Sistema de Roles

### Diseño

El sistema de roles está implementado de forma simple pero efectiva:

- **Campo `role`** en la tabla `users` con tipo ENUM
- **Valores posibles:** 'admin', 'mid', 'user'
- **Default:** 'user'

### Jerarquía de Acceso

```
admin    →  /admin, /mid, /dashboard
  ↓
mid      →  /mid, /dashboard
  ↓
user     →  /dashboard
```

### Componentes del Sistema

#### 1. Migración (`add_role_to_users_table`)

```php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['admin', 'mid', 'user'])
          ->default('user')
          ->after('email');
});
```

#### 2. Modelo User (Helpers)

```php
public function isAdmin(): bool
public function isMid(): bool
public function isUser(): bool
public function hasRole(string|array $roles): bool
```

#### 3. Middleware CheckRole

Ubicación: `app/Http/Middleware/CheckRole.php`

- Verifica autenticación
- Comprueba que el usuario tenga uno de los roles requeridos
- Regresa 403 si no tiene permiso
- Redirige a login si no está autenticado

#### 4. Registro del Middleware

En `bootstrap/app.php`:

```php
$middleware->alias([
    'role' => \App\Http\Middleware\CheckRole::class,
]);
```

## Rutas y Protección

### Rutas Públicas

```php
Route::view('/', 'welcome')->name('home');
```

### Rutas Autenticadas

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', UserDashboard::class)->name('dashboard');
    // ...
});
```

### Rutas con Roles

```php
// Solo mid y admin
Route::middleware(['role:mid,admin'])->group(function () {
    Route::get('/mid', MidDashboard::class)->name('mid.dashboard');
});

// Solo admin
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', AdminDashboard::class)->name('admin.dashboard');
});
```

## Componentes Livewire

### Estructura de un Componente

Cada componente Livewire consta de dos partes:

1. **Clase PHP** (`app/Livewire/.../*.php`)
   - Lógica del componente
   - Propiedades reactivas
   - Métodos de acción

2. **Vista Blade** (`resources/views/livewire/.../*.blade.php`)
   - Template HTML con Tailwind
   - Directivas Livewire
   - Directivas Alpine.js

### Dashboards Implementados

- **AdminDashboard**: Estadísticas de usuarios, acciones administrativas
- **MidDashboard**: Proyectos, tareas, actividad reciente
- **UserDashboard**: Perfil personal, actividad, accesos rápidos

## Flujo de Autenticación

```
1. Usuario visita /login
2. Laravel Breeze muestra formulario (Livewire)
3. Usuario envía credenciales
4. Breeze valida y autentica
5. Middleware 'auth' permite el acceso
6. Middleware 'role' verifica permisos
7. Usuario accede al dashboard correspondiente
```

## Flujo de Autorización

```
Request → auth middleware → verified middleware → role middleware → Controller/Livewire
           ↓                 ↓                      ↓
       ¿Autenticado?    ¿Email verificado?    ¿Rol correcto?
           ↓                 ↓                      ↓
        Login           Verify Email           403 Forbidden
```

## Testing

### Estrategia de Testing

1. **Tests de Autorización**: Verifican que el middleware bloquea accesos no autorizados
2. **Tests de Roles**: Verifican que cada rol acceda solo a sus rutas permitidas
3. **Tests de Helpers**: Verifican los métodos helper del modelo User

### Cobertura

- ✅ Redirección de usuarios no autenticados
- ✅ Acceso correcto según rol
- ✅ Bloqueo de acceso no autorizado
- ✅ Métodos helper del modelo

## Configuración de Tailwind

### Archivos Relevantes

- `tailwind.config.js`: Configuración de Tailwind
- `resources/css/app.css`: Importaciones de Tailwind
- `vite.config.js`: Configuración de Vite para compilar

### Dark Mode

El boilerplate incluye soporte completo para dark mode usando la clase `dark:` de Tailwind.

## Próximas Extensiones Recomendadas

### Gestión de Usuarios (Admin Panel)

- Crear, editar, eliminar usuarios
- Cambiar roles
- Suspender cuentas

### Permisos Granulares

Si necesitas control más fino, considera migrar a:
- Spatie Laravel Permission
- Laravel Bouncer

### API con Sanctum

Para crear una API:
- Instalar Laravel Sanctum
- Crear tokens de API
- Proteger rutas de API con roles

### Logs y Auditoría

- Laravel Activity Log (spatie/laravel-activitylog)
- Registrar acciones importantes
- Dashboard de logs para admin

---

**Nota:** Esta arquitectura está diseñada para ser **simple y extensible**. Puedes agregar funcionalidades sin romper la estructura base.
