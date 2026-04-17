# Recomendaciones de Mejora Visual y UX - Ministerio de Educación

Basado en el análisis del sistema actual y las reglas estrictas definidas en [design-system.md](file:///b:/Establecimientos/.agent/workflows/design-system.md), se proponen las siguientes mejoras para alinear la plataforma con la identidad institucional:

## 1. Estandarización de Colores y Clases Tailwind
- **Problema**: Existen muchos estilos en línea (`style={{ color: '#FE8204' }}`) que dificultan el mantenimiento.
- **Solución**: Reemplazar todos los estilos en línea por clases de Tailwind personalizadas definidas en `tailwind.config.js` (ej: `text-brand-orange`, `bg-brand-orange`, `border-brand-orange`).
- **Prioridad**: Alta

## 2. Tipografía y Legibilidad (Texto Negro Puro)
- **Problema**: El sistema usa escalas de grises (`text-gray-900`, `text-gray-500`) que no cumplen con la regla de "Negro Puro (#000000)".
- **Solución**: 
  - Cambiar el texto principal de `text-gray-900` a `text-black` (#000000).
  - Usar un peso de fuente mayor o `opacity` para textos secundarios si es necesario, pero manteniendo la base negra.
- **Prioridad**: Crítica (Accesibilidad y Marca)

## 3. Cabeceras de Tablas Institucionales
- **Problema**: Actualmente las tablas usan `bg-gray-50` en los encabezados.
- **Solución**: Actualizar los `<thead>` de todas las tablas (Auditoría, Edificios, Establecimientos, Bitácora) para usar `bg-brand-orange` con texto blanco o negro puro dependiendo del contraste.
  - Clase sugerida: `bg-brand-orange text-white uppercase font-black text-[10px] tracking-widest`.
- **Prioridad**: Media

## 4. Unificación de Estados y Alertas
- **Problema**: Se utilizan colores no institucionales (Verde, Azul) para estados que el manual no contempla.
- **Solución**:
  - **Crítico/Error**: Usar Rojo (#E43C2F).
  - **Pendiente/En Proceso**: Usar Amarillo (#FADC3C) como acento.
  - **Finalizado/Correcto**: Usar Naranja (#FE8204) o mantener el verde solo si se permite como "Estado de Éxito", pero bajo la estética del Ministerio.
- **Prioridad**: Alta

## 5. Refinamiento de Layout (AuthenticatedLayout)
- **Problema**: El sidebar/navbar tiene sombras y bordes incoherentes.
- **Solución**:
  - Eliminar sombras genéricas y usar bordes sólidos de `1px` en `#FE8204`.
  - El fondo debe ser siempre blanco puro (#FFFFFF), eliminando los `bg-gray-100` residuales en el fondo de la aplicación.
- **Prioridad**: Media

## 6. Iconografía y Énfasis
- **Problema**: Iconos en `text-gray-400`.
- **Solución**: Los iconos decorativos o informativos deben usar `text-brand-orange` o `text-black` para ganar presencia visual.
- **Prioridad**: Baja

---
> [!IMPORTANT]
> Se recomienda realizar un barrido general de los componentes `PrimaryButton` y `SecondaryButton` para asegurar que hereden correctamente los colores `#FE8204` y `#FFFFFF` respectivamente.
