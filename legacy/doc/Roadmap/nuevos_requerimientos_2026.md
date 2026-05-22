# Roadmap - Nuevos Requerimientos 2026

## Visión General

Este roadmap detalla la implementación de mejoras críticas al sistema de gestión de establecimientos educativos, enfocándose en:
1. Optimización de la interfaz del mapa público
2. Mejora del dashboard administrativo con visualizaciones
3. Expansión de filtros en gestión de modalidades
4. Rediseño completo del sistema de auditorías con gestión de estados

---

## Fase 1: Rediseño del Mapa Público 🗺️

**Prioridad:** Alta  
**Complejidad:** Media  
**Estimación:** 3-4 días  
**Dependencias:** Ninguna

### Objetivos
- Mejorar la experiencia visual del mapa
- Ampliar la información mostrada en los popups de edificios
- Optimizar el diseño responsivo

### Tareas

#### 1.1 Optimización de Layout y Zoom
- [ ] Rediseñar las proporciones del mapa para que al 100% de zoom se vea como actualmente se ve al 80%
  - **Nota:** El zoom al 80% es solo una referencia visual de las proporciones deseadas
  - El objetivo es lograr ese espaciado y proporción de forma nativa al 100%
- [ ] Ajustar el ancho de la columna lateral de búsqueda/filtros (hacerla más estrecha)
- [ ] Dar más espacio al contenedor del mapa
- [ ] Implementar diseño responsivo que mantenga usabilidad en diferentes resoluciones
- [ ] Ajustar tamaños de fuente y espaciados para mejor legibilidad
- [ ] Optimizar el tamaño de los popups para que sean más amplios y legibles

**Archivos a modificar:**
- `resources/views/livewire/publico/mapa-publico.blade.php`
- CSS relacionado al mapa

#### 1.2 Expansión de Información en Popups
- [ ] Ampliar el popup de edificios para mostrar más datos
- [ ] Agregar campos adicionales por establecimiento:
  - Radio
  - Tipo de Modalidad Educativa
  - Categoría
  - Departamento/Zona
- [ ] Mejorar el diseño visual del popup para múltiples establecimientos
- [ ] Implementar scroll interno si hay muchos establecimientos

**Archivos a modificar:**
- `app/Livewire/Publico/MapaPublico.php`
- Vista del popup (blade)
- `app/Http/Controllers/Api/EdificiosMapaController.php` (agregar campos en la respuesta)

#### 1.3 Actualización de Modelos
- [ ] Verificar que los campos Radio, Categoría estén disponibles en las relaciones
- [ ] Optimizar consultas para incluir los nuevos campos sin impacto en performance

**Archivos a modificar:**
- `app/Models/Modalidad.php`
- `app/Models/Establecimiento.php`

---

## Fase 2: Expansión de Filtros en Modalidades 🔍

**Prioridad:** Alta  
**Complejidad:** Baja  
**Estimación:** 1-2 días  
**Dependencias:** Ninguna

### Objetivos
- Permitir filtrado avanzado por todos los campos disponibles
- Replicar la funcionalidad de análisis que tenías en Excel

### Tareas

#### 2.1 Implementación de Filtros Adicionales
- [ ] Agregar filtro por Radio
- [ ] Agregar filtro por Categoría
- [ ] Agregar filtro por Departamento/Zona
- [ ] Agregar filtro por Sector
- [ ] Agregar filtro por Dirección de Área
- [ ] Mantener filtros existentes (Nivel, Ámbito)

**Archivos a modificar:**
- `app/Livewire/Admin/ModalidadesTable.php`
- `resources/views/livewire/admin/modalidades-table.blade.php`

#### 2.2 Mejora de UI de Filtros
- [ ] Organizar filtros en secciones colapsables
- [ ] Implementar botón "Limpiar filtros"
- [ ] Mostrar contador de resultados filtrados
- [ ] Agregar indicador visual de filtros activos

---

## Fase 3: Dashboard Administrativo con Gráficas 📊

**Prioridad:** Media  
**Complejidad:** Media-Alta  
**Estimación:** 4-5 días  
**Dependencias:** Ninguna

### Objetivos
- Crear visualizaciones claras para presentar a autoridades
- Mostrar estadísticas clave del sistema educativo

### Tareas

#### 3.1 Selección e Instalación de Librería de Gráficas
- [ ] Evaluar opciones: Chart.js, ApexCharts, o Livewire Charts
- [ ] Instalar y configurar la librería seleccionada
- [ ] Crear componentes reutilizables para gráficas

**Recomendación:** Livewire Charts (integración nativa) o ApexCharts (más opciones visuales)

#### 3.2 Implementación de Gráficas
- [ ] **Gráfica 1:** Distribución por Modalidad Educativa (Pie/Donut)
- [ ] **Gráfica 2:** Distribución por Categoría (Bar Chart)
- [ ] **Gráfica 3:** Distribución por Departamento/Zona (Bar Chart horizontal)
- [ ] **Gráfica 4:** Distribución por Radio (Pie Chart)
- [ ] **Gráfica 5:** Distribución Público vs Privado (Donut)
- [ ] **Gráfica 6:** Evolución temporal de establecimientos (Line Chart - si hay datos históricos)

#### 3.3 Rediseño del Dashboard
- [ ] Crear layout de grid responsivo para las gráficas
- [ ] Mantener cards de estadísticas numéricas existentes
- [ ] Agregar filtro de fecha para gráficas temporales
- [ ] Implementar exportación de gráficas a PDF/PNG

**Archivos a modificar:**
- `app/Livewire/Administrativos/AdministrativosDashboard.php`
- `resources/views/livewire/administrativos/administrativos-dashboard.blade.php`
- Crear nuevos componentes de gráficas si es necesario

---

## Fase 4: Rediseño del Sistema de Auditorías ✅

**Prioridad:** Crítica  
**Complejidad:** Alta  
**Estimación:** 6-8 días  
**Dependencias:** Ninguna (pero es el cambio más grande)

### Objetivos
- Transformar el sistema de auditorías en un sistema de validación y gestión de estados
- Implementar workflow de estados para establecimientos
- Generar reportes e informes por estado

### Tareas

#### 4.1 Rediseño de Base de Datos

**Nueva estructura de estados:**
- `correcto` - Datos validados y correctos
- `corregido` - Datos que fueron corregidos
- `pendiente` - Requiere revisión o confirmación
- `baja` - Establecimiento dado de baja (puede reactivarse)
- `eliminado` - Establecimiento eliminado permanentemente

- [ ] Crear migración para agregar campos de estado a `modalidades`:
  - `estado_validacion` (enum: correcto, corregido, pendiente, baja, eliminado)
  - `fecha_ultimo_cambio_estado` (timestamp)
  - `observaciones_estado` (text, nullable)
  - `usuario_validacion_id` (foreign key a users)
  
- [ ] Crear tabla `historial_estados_modalidad`:
  - `id`
  - `modalidad_id`
  - `estado_anterior`
  - `estado_nuevo`
  - `fecha_cambio`
  - `usuario_id`
  - `observaciones`
  - `timestamps`

**Archivos a crear:**
- `database/migrations/YYYY_MM_DD_add_estado_validacion_to_modalidades.php`
- `database/migrations/YYYY_MM_DD_create_historial_estados_modalidad_table.php`
- `app/Models/HistorialEstadoModalidad.php`

#### 4.2 Actualización de Modelos

- [ ] Agregar relación `historialEstados()` en `Modalidad`
- [ ] Agregar relación `usuarioValidacion()` en `Modalidad`
- [ ] Crear scopes para filtrar por estado
- [ ] Implementar métodos para cambio de estado con registro automático

**Archivos a modificar:**
- `app/Models/Modalidad.php`

#### 4.3 Rediseño de la Vista de Auditorías

- [ ] Cambiar de tabla de auditorías a tabla de modalidades con estados
- [ ] Implementar filtros:
  - Por Estado (correcto, corregido, pendiente, baja, eliminado)
  - Por Ámbito (Público/Privado)
  - Por Modalidad Educativa
  - Por Departamento/Zona
  - Por Nombre de Establecimiento
  - Por CUE
  - Por Rango de Fechas
  
- [ ] Agregar columnas:
  - Estado actual (con badge de color)
  - Fecha último cambio
  - Usuario que validó
  - Acciones (Ver historial, Cambiar estado)

**Archivos a modificar:**
- `app/Livewire/Admin/AuditoriaEdugeTable.php` → Renombrar a `ValidacionModalidadesTable.php`
- `resources/views/livewire/admin/auditoria-eduge-table.blade.php`

#### 4.4 Implementación de Gestión de Estados

- [ ] Crear modal/formulario para cambio de estado
- [ ] Validar transiciones de estado permitidas
- [ ] Implementar confirmación para estados críticos (baja, eliminado)
- [ ] Registrar automáticamente en historial cada cambio
- [ ] Agregar campo de observaciones obligatorio para ciertos cambios

**Archivos a crear:**
- `app/Livewire/Admin/CambiarEstadoModalidad.php` (componente modal)

#### 4.5 Vista de Historial de Estados

- [ ] Crear vista de timeline para ver historial de un establecimiento
- [ ] Mostrar usuario, fecha, estado anterior/nuevo, observaciones
- [ ] Permitir filtrado y búsqueda en el historial

**Archivos a crear:**
- `app/Livewire/Admin/HistorialEstadosModalidad.php`
- Vista correspondiente

#### 4.6 Dashboard de Estados

- [ ] Crear dashboard específico para visualizar estados
- [ ] Gráficas:
  - Distribución por estado (Pie Chart)
  - Evolución de estados en el tiempo (Line Chart)
  - Top 10 departamentos con más pendientes
  - Estadísticas de validación por usuario
  
- [ ] Cards con métricas:
  - Total validados (correctos)
  - Pendientes de revisión
  - Corregidos este mes
  - Establecimientos dados de baja

**Archivos a crear:**
- `app/Livewire/Admin/DashboardEstados.php`
- Vista correspondiente

#### 4.7 Generación de Informes PDF

- [ ] Crear servicio para generación de PDFs por estado
- [ ] Implementar filtros para el informe:
  - Por estado específico
  - Por rango de fechas
  - Por departamento/zona
  
- [ ] Diseñar template del PDF:
  - Encabezado con logo y fecha
  - Resumen ejecutivo
  - Tabla detallada de establecimientos
  - Gráficas de distribución
  - Pie de página con totales

**Archivos a crear:**
- `app/Services/InformeEstadosService.php`
- `app/Http/Controllers/Admin/InformeEstadosPDFController.php`
- Vista del PDF

#### 4.8 Actualización de Rutas

- [ ] Crear rutas para el nuevo sistema:
  - `/administrativos/validacion` (tabla principal)
  - `/administrativos/validacion/{id}/historial`
  - `/administrativos/validacion/dashboard-estados`
  - `/administrativos/validacion/informe-pdf`

**Archivos a modificar:**
- `routes/web.php`

#### 4.9 Actualización de Navegación

- [ ] Renombrar "Auditorías" a "Validación de Datos" en menús
- [ ] Agregar submenú si es necesario:
  - Validar Modalidades
  - Dashboard de Estados
  - Informes

**Archivos a modificar:**
- `resources/views/layouts/app.blade.php`
- `resources/views/livewire/layout/navigation.blade.php`

#### 4.10 Migración de Datos Existentes

- [ ] Crear seeder para inicializar estados de modalidades existentes
- [ ] Definir estado por defecto: `pendiente`
- [ ] Opcionalmente, marcar como `correcto` las que ya tienen `validado = true`

**Archivos a crear:**
- `database/seeders/InicializarEstadosModalidadesSeeder.php`

---

## Fase 5: Testing y Refinamiento 🧪

**Prioridad:** Alta  
**Complejidad:** Media  
**Estimación:** 2-3 días  
**Dependencias:** Todas las fases anteriores

### Tareas

- [ ] Pruebas de integración del sistema de estados
- [ ] Verificar performance con datos reales
- [ ] Pruebas de generación de PDFs
- [ ] Validar filtros y búsquedas
- [ ] Pruebas de usabilidad con usuarios finales
- [ ] Ajustes de UI/UX según feedback
- [ ] Documentación de usuario

---

## Cronograma Estimado

| Fase | Duración | Inicio Sugerido |
|------|----------|-----------------|
| Fase 1: Rediseño Mapa | 3-4 días | Semana 1 |
| Fase 2: Filtros Modalidades | 1-2 días | Semana 1 |
| Fase 3: Dashboard Gráficas | 4-5 días | Semana 2 |
| Fase 4: Sistema Auditorías | 6-8 días | Semana 2-3 |
| Fase 5: Testing | 2-3 días | Semana 4 |

**Total estimado:** 16-22 días de desarrollo

---

## Priorización Recomendada

### Sprint 1 (Semana 1-2)
1. **Fase 2** - Filtros en Modalidades (rápido, alto impacto)
2. **Fase 1** - Rediseño del Mapa (visible para usuarios públicos)

### Sprint 2 (Semana 2-3)
3. **Fase 4** - Sistema de Auditorías (crítico, más complejo)

### Sprint 3 (Semana 3-4)
4. **Fase 3** - Dashboard con Gráficas (mejora visual)
5. **Fase 5** - Testing y refinamiento

---

## Consideraciones Técnicas

### Performance
- Implementar caché para gráficas del dashboard
- Optimizar queries con eager loading para evitar N+1
- Indexar columnas de estado y fechas para búsquedas rápidas

### Seguridad
- Validar permisos para cambio de estados
- Registrar todos los cambios en historial (auditoría)
- Proteger rutas de informes PDF

### Escalabilidad
- Diseñar sistema de estados extensible para futuros estados
- Permitir configuración de colores y etiquetas de estados
- Considerar soft deletes para establecimientos "eliminados"

---

## Notas Adicionales

### Estados y Transiciones Permitidas

```
pendiente → correcto
pendiente → corregido
pendiente → baja
correcto → corregido (si se detecta error)
correcto → baja
corregido → correcto
baja → correcto (reactivación)
cualquiera → eliminado (acción administrativa)
```

### Colores Sugeridos para Estados

- **Correcto:** Verde (#10B981)
- **Corregido:** Azul (#3B82F6)
- **Pendiente:** Amarillo (#F59E0B)
- **Baja:** Naranja (#F97316)
- **Eliminado:** Rojo (#EF4444)

---

## Próximos Pasos

1. ✅ Revisar y aprobar este roadmap
2. ⏳ Decidir orden de implementación según prioridades
3. ⏳ Crear issues/tickets en el sistema de gestión
4. ⏳ Comenzar con Fase 2 (filtros) por ser rápida y de alto impacto
