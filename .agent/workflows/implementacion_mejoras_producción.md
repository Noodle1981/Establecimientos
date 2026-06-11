# Implementación de Mejoras de Producción - Módulo de Auditoría

Este documento detalla la auditoría, optimizaciones, correcciones y robustez implementadas en el panel de auditoría (`/administrativos/auditoria`) y servicios relacionados para el entorno de producción.

---

## 1. Auditoría de Seguridad (Backend y Rutas)

### Control de Acceso y Middleware
*   **Rutas Protegidas**: Las rutas del panel de auditoría en [web.php](file:///b:/Establecimientos/routes/web.php) se encuentran encapsuladas dentro del middleware de autenticación global (`auth`) y el middleware de roles específico:
    ```php
    Route::middleware(['role:admin,administrativos'])->prefix('administrativos')->group(function () {
        Route::get('/auditoria', [AuditoriaController::class, 'index'])->name('administrativos.auditoria.index');
        Route::patch('/auditoria/{id}/estado', [AuditoriaController::class, 'updateEstado'])->name('administrativos.auditoria.updateEstado');
        ...
    });
    ```
    Esto garantiza de manera estricta que solo los usuarios autorizados (administradores y personal administrativo) accedan al panel y modifiquen estados.

### Validación de Datos y Protección Mass Assignment
*   **Form Request Dedicado**: Se implementó [UpdateAuditoriaRequest](file:///b:/Establecimientos/app/Http/Requests/Administrativos/UpdateAuditoriaRequest.php) para validar rigurosamente los datos de entrada en la actualización de estados.
*   **Restricción de Valores Permitidos**: 
    *   `estado` se restringe de forma explícita a la lista blanca: `PENDIENTE, CORRECTO, CORREGIDO, REVISAR, BAJA`.
    *   `campos_auditados` debe ser un array, y cada elemento individual está validado contra campos permitidos (`Nombre`, `Dirección`, `Edificio`, `CUI`, `CUE`, `GPS`, `RADIO`, etc.). Esto previene inyecciones de datos no autorizados en el campo JSON de auditoría.
*   **Preferencia por Consultas Seguras**: Todas las consultas a la base de datos utilizan Eloquent u ORM Binding nativo de Laravel, eliminando el riesgo de inyección SQL a nivel de parámetros de filtro.

---

## 2. Optimización y Concurrencia (SQLite)

### Estrategia de Caché e Invalidación Reactiva
*   **Filtros Dinámicos con Caché**: En `AuditoriaQueryService::getFilterOptions`, las opciones del dropdown (departamentos, niveles) que solían requerir consultas de tipo `distinct()` complejas ahora se almacenan en caché por una hora usando una clave hash MD5 de los filtros seleccionados (`'auditoria_options_' . md5(...)`). Esto reduce sustancialmente el número de lecturas en base de datos al navegar por el panel.
*   **Mapa de Nombres de Edificios**: El listado del panel y la generación del PDF consultan de forma recurrente los nombres descriptivos de los edificios. Se unificó esta lógica en `Edificio::getNamesMap()` y se cacheó bajo la llave `'edificios_names_map'`.
*   **Invalidación Atómica**: A través del observador [MapaCacheObserver](file:///b:/Establecimientos/app/Observers/MapaCacheObserver.php), cualquier inserción, edición o eliminación en los modelos realiza un `Cache::flush()`. Esto asegura la consistencia de los datos en tiempo real (inmediatamente visibles en mapas, dashboards y reportes) sin dejar caché obsoleto en el sistema.

### Gestión de Concurrencia en SQLite
*   **Transacciones Compactas**: La actualización de estados de validación y la propagación de campos compartidos al edificio en `AuditoriaController::updateEstado()` están envueltas en un bloque `DB::transaction()`.
*   **Acción Rápida**: Para prevenir el bloqueo de la base de datos (`Database is locked`) en SQLite bajo escrituras concurrentes, la transacción se ejecuta de manera sumamente rápida, evitando cualquier operación de red, llamadas externas o cálculos pesados dentro de su bloque.
*   **Indexación Estratégica**: Las columnas de filtros recurrentes y relaciones de claves foráneas cuentan con índices de rendimiento definidos en la migración `2026_03_19_114251_add_performance_indexes_to_tables.php`, lo que minimiza el tiempo de bloqueo en lecturas de SQLite.

---

## 3. Rendimiento en la Capa Inertia.js 2.x y React

### Paginación Eficiente
*   El panel de auditoría implementa paginación (`paginate(10)`) en el servidor. Esto previene la sobrecarga de memoria en el navegador del usuario al transferir colecciones masivas de datos relacionales a través de Inertia.

### Reducción del Tráfico e Inertia Request Storms
*   **Debouncing de Filtros**: Las entradas de texto de búsqueda (`search`, `cui`) en el frontend implementan un temporizador Debounce manual de 300 milisegundos. De esta manera, se evita que cada pulsación de tecla ejecute un reload en el servidor, protegiendo al backend de ráfagas innecesarias.
*   **Resolución de N+1 en React**: Se eliminó la carga repetitiva de nombres de edificios en las filas de la tabla de auditoría, proveyendo al frontend un diccionario indexado (`nombresEdificios`) precalculado y cacheado en el backend, resolviendo el problema de consultas duplicadas N+1.

---

## 4. Robustez en Reportes (DOMPDF)

### Compatibilidad de Estilos y Codificación
*   **Soporte de Caracteres**: Se configuró la tipografía `'DejaVu Sans'` en el PDF de auditoría ([auditoria_reporte.blade.php](file:///b:/Establecimientos/resources/views/pdf/auditoria_reporte.blade.php)) para garantizar el renderizado correcto de la letra "Ñ", vocales acentuadas, y símbolos especiales como el de grados (GPS).
*   **Maquetación en Tablas Tradicionales**: Dado que DOMPDF no soporta Flexbox o CSS Grid modernos, el reporte de auditoría se diseñó utilizando tablas HTML tradicionales (`<table>`) y anchos porcentuales estrictos. Esto previene desbordamientos horizontales o saltos de página erráticos en el formato horizontal (Landscape A4).
*   **Consumo de Memoria**: La obtención de anomalías para el PDF reutiliza la query optimizada y filtrada en lugar de cargar toda la base de datos, manteniendo los tiempos de ejecución y uso de memoria RAM del servidor dentro de parámetros seguros para producción.

---

## 5. Estrategia de Testing (QA)

### Cobertura de Pruebas Automatizadas
*   La suite de pruebas en Pest/PHPUnit valida todo el ciclo de vida del módulo:
    *   `Tests\Feature\AuditoriaReconciliationTest`: Verifica que los flujos de propagación granular de campos entre escuelas vinculadas al mismo edificio funcionen correctamente y no pisen observaciones individuales.
    *   `Tests\Feature\RoleAuthorizationTest`: Valida de forma estricta que usuarios sin roles o con roles insuficientes no puedan interactuar con las rutas `/administrativos/auditoria` ni descargar los reportes.
    *   `Tests\Feature\RefactorIntegrityTest`: Asegura la consistencia general del sistema frente a operaciones de eliminación lógica (soft-delete), cascadas y restauraciones de datos.

### Resultados del Ejecutor de Tests
Actualmente, la suite corre 59 tests con 172 aserciones obteniendo una aprobación del 100%:
```bash
Tests:    59 passed (172 assertions)
Duration: 3.75s
```
