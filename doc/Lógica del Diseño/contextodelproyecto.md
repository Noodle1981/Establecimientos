# Contexto Original del Proyecto

> [!WARNING]
> **Actualización Crítica de Arquitectura (2026):**
> Aunque este documento original contemplaba la utilización de *Livewire* (punto 10), el proyecto fue migrado y completado exitosamente utilizando **React 18 + Inertia.js 2.x**. Cualquier desarrollo actual debe realizarse utilizando componentes React (.jsx) en `resources/js/Pages/` y no con Livewire/Blade.

Este proyecto tiene 3 objetivos principales:

1. **Auditoría de Datos:** Validación y limpieza profunda de la base de datos de establecimientos educativos del Ministerio de Educación de la Provincia de San Juan.
2. **Control EDUGE:** Cruzar y auditar los datos cargados en la plataforma web externa de la empresa privada (EDÚGE) para verificar que coincidan plenamente con los datos locales del sistema (ej. si hay 1160 escuelas en el sistema, debe haber el mismo número en EDÚGE).
3. **Estructura Pública (Mapa):** Diseñar un visor de mapas interactivo georreferenciado público que permita a los ciudadanos y distintas áreas u oficinas ministeriales consultar y filtrar las ubicaciones escolares y datos básicos.

## Reglas y Directrices Generales:

4. **Ámbitos:** Cubrirá escuelas tanto de gestión Estatal (públicas) como Privada. Se usará el término "Estatales" para evitar confusiones con rutas o accesos públicos de la aplicación.
5. **Roles de Usuario:** Contemplar roles para `admin`, `administrativos` (gestores) y usuarios públicos sin login.
6. **Autenticación:** Sistema seguro de inicio de sesión y registro de usuarios.
7. **Sistema de Permisos:** Estructurar rutas seguras bajo prefijos según rol (`/admin` y `/administrativos`), redirigiendo a los usuarios según corresponda.
8. **Origen de Datos:** La base de datos se alimentará inicialmente de la importación guiada de una planilla Excel (`Establecimientos_Publicos.xlsx`).
9. **Diseño:** Usar el sidebar top/lateral como layout de navegación.
10. **Frontend:** Usar componentes **React 18 + Inertia.js 2.x** (Actualizado).
11. **Estilos:** Aplicar **Tailwind CSS 3.x** bajo las directrices estrictas de marca del Ministerio.
12. **Base de Datos:** Usar **SQLite** estructurado relacionalmente.
13. **Contexto:** Mantener actualizados los archivos de contexto en `.agent/` para guiar correctamente al asistente inteligente de IA.
14. **Roadmap:** Diseñar y seguir el cronograma de fases de desarrollo.
15. **Auditoría y Testing:** Realizar auditorías de seguridad, velocidad y aplicar suite de testing automatizada.