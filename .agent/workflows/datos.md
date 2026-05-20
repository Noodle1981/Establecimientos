---
description: Importación de Excel, normalización de datos relacionales, indexación de SQLite y estrategias de caché de consultas.
---

# 📊 Workflow de Importación, Estructura y Caché de Datos

Este workflow describe las operaciones críticas de procesamiento de datos, importación de planillas, normalizaciones requeridas y optimización de rendimiento para el motor de base de datos SQLite.

---

## 📥 Importación del Excel Masivo y Normalización

La carga masiva de datos se realiza a través de la consola Artisan ejecutando el comando:
```bash
php artisan import:establecimientos [nombre_archivo.xlsx]
```
Este comando delega la lógica al servicio `ExcelImportService.php`.

### Reglas de Procesamiento de Campos Requeridas:

1.  **Normalización de Coordenadas (GPS):**
    *   El Excel original expone las coordenadas en formato con coma decimal (`-31,4223061`).
    *   **Acción:** Es obligatorio sanitizar estas cadenas reemplazando la coma por punto flotante antes de la conversión decimal para evitar que SQLite trunque los datos:
    ```php
    $latitud = (float) str_replace(',', '.', $row['latitud']);
    $longitud = (float) str_replace(',', '.', $row['longitud']);
    ```

2.  **Validación de Ámbito:**
    *   Normalizar y pasar a mayúsculas para cumplir el dominio:
    ```php
    $ambito = strtoupper(trim($row['Ámbito'])); // Debe ser 'PUBLICO' o 'PRIVADO'
    ```

3.  **Lógica de Inserción Atómica (3 Niveles):**
    *   **Edificios:** Buscar por `cui` (único). Si no existe, crear el registro físico con los datos de calle, localidad, coordenadas y departamento.
    *   **Establecimientos:** Buscar o crear el establecimiento basado en el `cue` (único) y vincularlo al `edificio_id` obtenido.
    *   **Modalidades:** Insertar cada fila del Excel como una modalidad, asociándola al establecimiento correspondiente.

---

## ⚡ Estrategias de Rendimiento y Caché de Consultas

La visualización de mapas y el Dashboard administrativo con gráficas pueden degradar su rendimiento al realizar consultas complejas recurrentes sobre SQLite.

### 1. Indexación de Base de Datos (SQLite)
Para búsquedas y filtrados instantáneos, los siguientes campos de base de datos deben estar indexados (`database/migrations/`):
*   Tabla `modalidades`: índices compuestos o simples en `nivel_educativo`, `direccion_area`, `categoria`, `ambito`, y `estado_validacion`.
*   Tabla `establecimientos`: índice en `nombre` y `cue`.
*   Tabla `edificios`: índice en `zona_departamento` y `cui`.

### 2. Caché de Opciones de Filtros
Las listas desplegables de los filtros (Departamentos, Niveles y Direcciones de Área) rara vez sufren modificaciones después de la importación inicial.
*   **Acción:** Utilizar la fachada `Cache` de Laravel para almacenar los arrays de opciones por 24 horas (u 1 hora), reduciendo a cero el tiempo de respuesta en el render del Dashboard.
*   **Implementación en el Controlador (`DashboardController.php`):**
    ```php
    $departamentos = Cache::remember('dashboard-departamentos', 3600, function () {
        return Edificio::select('zona_departamento')
            ->distinct()
            ->whereNotNull('zona_departamento')
            ->orderBy('zona_departamento')
            ->pluck('zona_departamento');
    });
    ```

### 3. Caché de Datos de Gráficas
Los resultados compilados para representar los gráficos (ApexCharts / Chart.js) en el dashboard administrativo se cachean dinámicamente usando una clave hash basada en los filtros activos:
```php
$cacheKey = 'dashboard_data_react_' . md5(json_encode($filters));
$chartData = Cache::remember($cacheKey, 300, function () use ($filters) {
    return [
        'modalidades' => $this->getModalidadesData($filters),
        'zonas' => $this->getZonasData($filters),
        ...
    ];
});
```

---

## 📝 Lista de Verificación (Checklist) para Operaciones de Datos

*   [ ] ¿Las coordenadas lat/long se limpian reemplazando comas por puntos antes de parsearse como flotantes?
*   [ ] ¿Se verifica la existencia del Edificio (CUI) antes de intentar crear un nuevo Establecimiento (CUE)?
*   [ ] ¿Las consultas del dashboard utilizan `Cache::remember` para optimizar el rendimiento de base de datos?
*   [ ] ¿Se limpia la caché correspondiente (`Cache::forget`) cuando un administrativo realiza modificaciones en una modalidad o edificio?
*   [ ] ¿Las consultas con Eloquent usan Eager Loading (`with(['establecimiento.edificio'])`) para evitar el problema de consultas N+1?
