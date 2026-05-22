# Implementar Exportación a Excel para Establecimientos

El objetivo es permitir a los usuarios descargar la lista de establecimientos filtrada actual como un archivo Excel.

## Revisión del Usuario Requerida
> [!NOTE]
> Esta implementación genera el archivo Excel al vuelo usando `PhpSpreadsheet`. Para conjuntos de datos muy grandes (>5000 registros), esto podría ser lento. Dado que la vista paginada muestra 20, asumo que el conteo total es manejable (probablemente < 2000 para este dominio).

## Cambios Propuestos

### Lógica de la Aplicación
#### [MODIFICAR] [ModalidadesTable.php](file:///d:/Establecimientos/app/Livewire/Administrativos/ModalidadesTable.php)
- Importar clases de `PhpOffice\PhpSpreadsheet`.
- Extraer la lógica de filtrado de `render()` a un nuevo método `getFilteredQuery()` para asegurar que la exportación use exactamente los mismos filtros que la tabla en pantalla.
- Implementar el método `exportExcel()`:
    - Activar `getFilteredQuery()`.
    - Crear una nueva hoja de cálculo.
    - Agregar encabezados (CUE, CUI, NOMBRE, NIVEL, etc.).
    - Recorrer los datos y poblar las filas.
    - Transmitir la descarga del archivo como `establecimientos_{fecha}.xlsx`.

### Interfaz de Usuario (UI)
#### [MODIFICAR] [modalidades-table.blade.php](file:///d:/Establecimientos/resources/views/livewire/administrativos/modalidades-table.blade.php)
- Agregar botón "Exportar Excel" en la barra de acciones superior, probablemente junto a "Ver Eliminados".
- Usar `wire:loading` para mostrar retroalimentación durante la generación.

## Plan de Verificación

### Verificación Manual
1.  Navegar a `/administrativos/establecimientos`.
2.  Aplicar algunos filtros (ej. filtrar por "Nivel Inicial").
3.  Hacer clic en el nuevo botón "Exportar Excel".
4.  Verificar que el archivo descargado se abra en Excel.
5.  Verificar que las filas coincidan con los resultados filtrados en pantalla.
6.  Verificar que todas las columnas (CUE, CUI, Nombre, etc.) estén presentes y correctas.
