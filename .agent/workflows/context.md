---
description: Contexto del Proyecto - Establecimientos (M.E. San Juan)
---

# 📋 Contexto del Proyecto - Establecimientos (M.E. San Juan)

Plataforma del Ministerio de Educación de San Juan para gestionar, conciliar (con la base externa **EDÚGE**), y geolocalizar más de 1160 escuelas (estatales y privadas).

---

## 🛠️ Stack Tecnológico Real

*   **Backend:** Laravel 12.x (PHP 8.2+)
*   **Frontend:** React 18+ + Inertia.js 2.x (SPA monolítica, páginas en `resources/js/Pages/`)
*   **Base de Datos:** SQLite con soporte relacional e indexación.
*   **Visualización:** Leaflet.js (mapas) y Chart.js (gráficos).
*   **Reportes:** Barryvdh/laravel-dompdf (exportación horizontal de auditoría).

---

## 👥 Roles, Rutas y Permisos

| Rol | Dashboard / Ruta Base | Permisos y Alcance |
| :--- | :--- | :--- |
| **Administrador (`admin`)** | `/admin` | Gestión total de usuarios, bitácora de logs general y restauración física (`/admin/trash`). |
| **Administrativo (`administrativo`)** | `/administrativos/Panel` | Saneamiento de datos (Edificios, Modalidades, Instrumentos), auditoría de discrepancias y reportes. |
| **Público / Ciudadano** | `/mapa` | Consulta libre geolocalizada en mapa y envío de reportes ciudadanos (`/reportes`). |

---

## 📐 Jerarquía de Datos (3 Niveles)

El sistema procesa la planilla Excel original (`Establecimientos_Publicos.xlsx`) estructurando los datos relacionalmente:

1.  **Edificio (CUI) ➔ Tabla `edificios`:** Inmueble físico singular. Identificado por **CUI** único. Almacena dirección física, coordenadas GPS (normalizadas con punto decimal) y zona/departamento.
2.  **Establecimiento (CUE) ➔ Tabla `establecimientos`:** Institución que funciona en un edificio. Identificada por **CUE** único. Pertenece a un `edificio_id`.
3.  **Modalidad (Fila del Excel) ➔ Tabla `modalidades`:** Oferta educativa (Primario, Secundario, Inicial, Adultos) bajo un CUE. **Aquí reside el 90% de los datos (radio, categoría, ámbito, norma de creación) y el estado de auditoría.**

---

## 🏗️ Arquitectura Relacional (Base de Datos)

### 1. `edificios` (Inmueble Físico)
`id` (PK), `cui` (UNIQUE), `cabecera_cue` (FK/CUE), `calle`, `numero_puerta`, `orientacion`, `codigo_postal`, `localidad`, `latitud`, `longitud`, `letra_zona`, `zona_departamento`, `te_voip`.

### 2. `establecimientos` (Escuela)
`id` (PK), `edificio_id` (FK), `cue`, `cue_edificio_principal`, `nombre`, `establecimiento_cabecera`, `observaciones`.

### 3. `modalidades` (Oferta y Estado de Validación)
`id` (PK), `establecimiento_id` (FK), `direccion_area`, `nivel_educativo`, `sector`, `categoria`, `inst_legal_categoria`, `radio`, `inst_legal_radio`, `inst_legal_categoria_bis`, `inst_legal_creacion`, `ambito` ('PUBLICO'/'PRIVADO'), `validado` (bool), `estado_validacion` ('PENDIENTE', 'CORRECTO', 'CORREGIDO', 'BAJA', 'ELIMINADO'), `validado_por_user_id` (FK), `validado_en`, `zona`, `observaciones`, `campos_auditados` (JSON).

### 4. `historial_estados_modalidad` (Bitácora)
`id` (PK), `modalidad_id` (FK), `user_id` (FK), `estado_anterior`, `estado_nuevo`, `observaciones`, `campos_auditados` (JSON), `created_at`.

### 5. `auditorias_eduge` (Conciliación Externa)
`id` (PK), `establecimiento_id` (FK), `user_id` (FK), `fecha_visita`, `cambios` (JSON), `observaciones`, `tipo_cotejo`, `identificador_eduge`.

### 6. `reportes` (Denuncias / Sugerencias Ciudadanas)
`id` (PK), `edificio_id` (FK), `tipo`, `descripcion`, `nombre_remitente`, `email_remitente`, `estado` ('PENDIENTE', 'PROCESADO', etc.).

---

## 📝 Reglas Críticas de Negocio

*   **Normalización GPS:** Reemplazar obligatoriamente coma por punto flotante (`str_replace(',', '.', $val)`) al importar coordenadas del Excel para evitar truncados en SQLite.
*   **Bitácora Obligatoria:** Todo cambio en `estado_validacion` debe realizarse invocando `$modalidad->cambiarEstado($nuevoEstado, ...)` para disparar atómicamente la inserción en `historial_estados_modalidad`.
*   **Propagación a Nivel Edificio:** Al validar datos del edificio físico en una modalidad, el sistema puede propagar y sincronizar automáticamente los campos compartidos (`['Dirección', 'Edificio', 'CUI', 'GPS']`) a todas las modalidades de otros establecimientos del mismo `edificio_id`.

---

## 🎨 Principios de Diseño Visual Oficial (Design System)

*   **Colores de Marca:** Naranja `#FE8204` (`bg-brand-orange` para cabeceras y acciones primarias), Rojo `#E43C2F` (`bg-brand-red` para alertas/bajas), Amarillo `#FADC3C` (`bg-brand-yellow` para pendientes/acento).
*   **Accesibilidad (WCAG AA):** Todo el texto primario sobre fondo blanco **debe ser negro puro (`#000000` / `text-black`)** para máximo contraste. Evitar grises pálidos.
