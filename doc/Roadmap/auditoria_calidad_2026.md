# Roadmap de Mejora de Calidad 🗺️

Basado en la auditoría realizada el 02/01/2026, se definen los siguientes puntos de acción para garantizar la escalabilidad, estabilidad y fiabilidad del proyecto.

## 🔴 Prioridad Alta (Inmediata) - Foco: Estabilidad y Seguridad

### 1. Transacciones de Base de Datos
- **Problema:** Riesgo de datos inconsistentes en creaciones múltiples.
- **Acción:** Envolver `createEstablecimiento` y `updateModalidad` en `DB::transaction`.
- **Impacto:** Eliminación de inconsistencias en la base de datos.

### 2. Suite de Tests Core
- **Problema:** 0% cobertura en funcionalidades críticas.
- **Acción:** 
    - Implementar tests unitarios para `Modalidad::cambiarEstado()`.
    - Implementar tests de integración para el workflow de validación.
- **Impacto:** Prevención de regresiones y errores en producción.

---

## 🟡 Prioridad Media - Foco: Escalabilidad y Performance

### 3. Indexación de Base de Datos
- **Problema:** Filtrado lento con grandes volúmenes de datos.
- **Acción:** Crear migración para agregar índices a:
    - `modalidades`: `nivel_educativo`, `direccion_area`, `categoria`, `ambito`, `estado_validacion`.
    - `establecimientos`: `nombre`.
    - `edificios`: `zona_departamento`.
- **Impacto:** Búsquedas y filtrados instantáneos incluso con 100k+ registros.

### 4. Caché de Filtros
- **Problema:** Consultas `distinct()` repetitivas en cada renderizado.
- **Acción:** Implementar caché (ej. 24h) para las listas de opciones de los filtros.
- **Impacto:** Reducción de carga en el servidor de base de datos.

---

## 🟢 Prioridad Baja - Foco: Mantenibilidad y DX (Developer Experience)

### 5. Refactor de Componentes Livewire
- **Problema:** Componentes demasiado grandes y difíciles de navegar.
- **Acción:** Extraer modales de Edición/Creación a componentes Livewire independientes.
- **Impacto:** Código más legible y fácil de mantener.

### 6. Documentación Técnica (PHPDoc)
- **Problema:** Falta de descripción de parámetros y tipos en métodos complejos.
- **Acción:** Agregar bloques PHPDoc a todos los métodos de modelos y componentes.
- **Impacto:** Facilita la incorporación de nuevos desarrolladores.

---

## 📅 Cronograma Sugerido

| Semana | Acción | Objetivo |
|---|---|---|
| 1 | Transacciones e Índices | Asegurar la base de datos y performance inicial. |
| 2-3 | Implementación de Tests | Lograr un 40-50% de cobertura core. |
| 4 | Refactor y Caché | Optimización final de UX y DX. |

---

*Estado del Roadmap:* 🆕 **Pendiente de Inicio**
*Próxima Revisión:* 02/02/2026
