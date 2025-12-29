# 🗺️ Roadmap - Sistema de Gestión de Establecimientos Educativos

## 📊 Estado Actual del Proyecto

**Versión:** 1.0.0  
**Última actualización:** 29/12/2025

### ✅ Funcionalidades Implementadas

#### Core del Sistema
- ✅ Autenticación y autorización (4 roles: admin, administrativos, mid, user)
- ✅ Dashboards personalizados por rol
- ✅ Sistema de navegación responsive con glassmorphism
- ✅ Diseño consistente (blanco, negro, naranja #FF8200)

#### Gestión de Datos
- ✅ Modelo de datos 3 niveles: Edificio → Establecimiento → Modalidad
- ✅ CRUD completo de Modalidades (admin y administrativos)
- ✅ Soft deletes y restauración
- ✅ Políticas de autorización por rol
- ✅ Validación de datos (CUE 9 dígitos, CUI 7 dígitos)

#### Mapa Público
- ✅ Mapa interactivo estilo Google Maps con Leaflet
- ✅ 447 establecimientos con coordenadas visualizados
- ✅ Panel lateral colapsable con búsqueda en tiempo real
- ✅ Cards mejoradas mostrando:
  - Nombre del establecimiento
  - CUE
  - Dirección completa con icono 📍
  - Departamento/Zona con icono 📌
  - Badge PUBLICO/PRIVADO
- ✅ Popups informativos en marcadores
- ✅ Controles de zoom y centrado
- ✅ Accesible sin autenticación

#### Gestión de Usuarios
- ✅ Panel de administración de usuarios (solo admin)
- ✅ Edición de roles
- ✅ Eliminación de usuarios
- ✅ Búsqueda y filtrado

---

## 🚀 Próximas Funcionalidades

### Sprint 1: Módulo de Auditorías EDUGE
**Prioridad:** Alta  
**Estimación:** 4-6 horas  
**Estado:** 📋 Planificado

**Descripción:**
Sistema de registro y trazabilidad de modificaciones realizadas en EDUGE después de visitas in situ a establecimientos.

**Funcionalidades:**
- Registrar nueva auditoría (establecimiento, fecha, cambios, observaciones)
- Ver historial completo de auditorías
- Búsqueda y filtros (por establecimiento, fecha, usuario)
- Trazabilidad completa (quién, cuándo, qué cambió)
- Acceso: admin y administrativos

**Componentes a desarrollar:**
- [ ] Migración `create_auditorias_eduge_table`
- [ ] Modelo `AuditoriaEduge`
- [ ] Componente Livewire `AuditoriasEduge`
- [ ] Vista `auditorias-eduge.blade.php`
- [ ] Rutas y navegación
- [ ] Testing

**Referencia:** Ver `sprint_auditoria_eduge.md` para detalles completos

---

## 💡 Backlog de Ideas

### Features Potenciales

#### 1. Exportación de Datos
**Prioridad:** Media  
**Descripción:** Exportar datos de establecimientos a Excel/PDF
- Filtros personalizables
- Formatos: Excel, PDF, CSV
- Incluir mapas en PDF

#### 2. Importación Masiva desde EDUGE
**Prioridad:** Media  
**Descripción:** Importar datos directamente desde archivos EDUGE
- Validación automática de datos
- Detección de duplicados
- Preview antes de importar
- Log de importación

#### 3. Estadísticas y Reportes
**Prioridad:** Baja  
**Descripción:** Dashboard con estadísticas del sistema
- Establecimientos por departamento
- Distribución por nivel educativo
- Gráficos interactivos
- Exportar reportes

#### 4. Notificaciones
**Prioridad:** Baja  
**Descripción:** Sistema de notificaciones internas
- Notificar cambios importantes
- Recordatorios de auditorías pendientes
- Alertas de datos sin validar

#### 5. API Pública
**Prioridad:** Baja  
**Descripción:** API REST para consulta de datos
- Endpoints públicos (solo lectura)
- Documentación con Swagger
- Rate limiting
- Autenticación con tokens

#### 6. Búsqueda Avanzada
**Prioridad:** Media  
**Descripción:** Búsqueda global en todo el sistema
- Búsqueda por múltiples criterios
- Autocompletado
- Resultados agrupados
- Historial de búsquedas

#### 7. Gestión de Edificios
**Prioridad:** Media  
**Descripción:** CRUD completo para edificios
- Crear/editar edificios
- Asignar coordenadas manualmente
- Subir fotos del edificio
- Historial de cambios

#### 8. Sistema de Comentarios
**Prioridad:** Baja  
**Descripción:** Comentarios en establecimientos
- Agregar notas internas
- Mencionar usuarios
- Adjuntar archivos
- Historial de comentarios

---

## 🔧 Mejoras Técnicas

### Optimizaciones Pendientes

#### Performance
- [ ] Implementar caché para consultas frecuentes
- [ ] Optimizar queries N+1
- [ ] Lazy loading de imágenes en mapa
- [ ] Paginación server-side en tablas grandes

#### Seguridad
- [ ] Implementar 2FA para admin
- [ ] Logs de auditoría de acciones críticas
- [ ] Rate limiting en formularios
- [ ] Sanitización adicional de inputs

#### Testing
- [ ] Tests unitarios para modelos
- [ ] Tests de integración para componentes Livewire
- [ ] Tests E2E con Dusk
- [ ] Cobertura mínima 70%

#### DevOps
- [ ] CI/CD con GitHub Actions
- [ ] Deployment automático
- [ ] Backups automáticos de BD
- [ ] Monitoring con Laravel Telescope

---

## 📝 Notas de Desarrollo

### Convenciones del Proyecto

**Código:**
- Laravel 12.x
- Livewire 3.x
- Tailwind CSS
- SQLite (desarrollo) / PostgreSQL (producción)

**Estilos:**
- Color primario: `#FF8200` (naranja)
- Fondo: blanco
- Texto: negro
- Glassmorphism para cards y modales

**Estructura:**
- Componentes Livewire en `app/Livewire/{Rol}/`
- Vistas en `resources/views/livewire/{rol}/`
- Modelos en `app/Models/`
- Políticas en `app/Policies/`

**Git:**
- Commits descriptivos en español
- Branches: `main` (producción), `develop` (desarrollo)
- Pull requests para features importantes

---

## 🎯 Objetivos a Largo Plazo

### Q1 2026
- ✅ Sistema base funcional
- 🔄 Módulo de Auditorías EDUGE
- 📋 Exportación de datos
- 📋 Importación masiva

### Q2 2026
- 📋 Estadísticas y reportes
- 📋 Búsqueda avanzada
- 📋 Gestión completa de edificios

### Q3 2026
- 📋 API pública
- 📋 Sistema de notificaciones
- 📋 Mejoras de performance

### Q4 2026
- 📋 Testing completo
- 📋 Documentación exhaustiva
- 📋 Deployment a producción

---

## 📞 Contacto y Soporte

**Desarrollador:** Omar Olivera  
**Institución:** Ministerio de Educación - San Juan  
**Proyecto:** Sistema de Gestión de Establecimientos Educativos

---

## 📚 Documentación Relacionada

- `sprint_auditoria_eduge.md` - Sprint detallado módulo de auditorías
- `task.md` - Tareas actuales en progreso
- `walkthrough.md` - Guía de funcionalidades implementadas
- `implementation_plan.md` - Planes de implementación

---

**Última actualización:** 29/12/2025 14:25
