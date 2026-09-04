---
description: Auditar 
---

1. Auditoría de Seguridad (Backend y Rutas)

"Actuá como un experto en ciberseguridad y auditoría de código en Laravel 12. Analizá el siguiente controlador y archivo de rutas buscando vulnerabilidades. Prestá especial atención a:Verificación estricta de políticas de acceso (Policies/Gates) en cada método.Validación de datos de entrada (Form Requests) para prevenir Inyección SQL (especialmente con SQLite).Uso correcto de Middlewares de autenticación y protección contra Mass Assignment.Filtrado de datos sensibles antes de enviarlos a Inertia.

2. Optimización y Concurrencia (SQLite)

"Actuá como un Administrador de Bases de Datos especializado en SQLite para producción. Analizá mis migraciones y consultas Eloquent. SQLite maneja bloqueos a nivel de base de datos en escritura; optimizá el código considerando:Estrategias para evitar el error 'Database is locked' bajo concurrencia.Uso correcto de transacciones (DB::transaction) para mantener la integridad relacional.Verificación de que las columnas clave tengan índices ($table->index()) para acelerar búsquedas en mapas (Leaflet) y gráficos (Chart.js)."

3. Rendimiento en la capa Inertia.js 2.x y React

"Actuá como un Ingeniero de Rendimiento Web senior. Analizá este componente de React 18 y cómo recibe los datos desde el controlador de Laravel a través de Inertia.js 2. Buscá ineficiencias en:Uso de Lazy Props en Inertia para no precargar datos pesados innecesariamente (ej. datos de mapas o gráficos).Problemas de re-renderizado en React al procesar coordenadas de Leaflet o datasets de ApexCharts.Evitar el problema de consultas N+1 al pasar colecciones Eloquent al frontend.

4. Robustez en Reportes (DOMPDF)

"Actuá como desarrollador backend experto en Laravel. Analizá el siguiente código encargado de generar un reporte horizontal con barryvdh/laravel-dompdf. Evaluá y corregí:Consumo de memoria RAM al procesar grandes volúmenes de datos de auditoría (uso de chunk() o lazy()).Estilos CSS compatibles con DOMPDF para evitar desbordamientos en la vista horizontal (landscape).Tiempos de ejecución para prevenir un 'Maximum execution time exceeded'.Aquí está el código del controlador y la vista Blade del reporte: [Pegar código]"5. Generación de Estrategia de Testing (QA)"Actuá como un Ingeniero de QA automatizado. Diseñá la estructura de pruebas unitarias y de integración para este flujo específico en Laravel 12 (Pest/PHPUnit) e Inertia. Generame:Casos de prueba para verificar que los gráficos y mapas reciban la estructura de datos correcta (assertInertia).Tests de integración que simulen usuarios con diferentes roles interactuando con las rutas.Tests específicos para la descarga exitosa del PDF."


hacer un reporte nuevo llamado implementacion_mejoras_producción.md en la carpeta worklows