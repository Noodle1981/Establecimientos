---
name: design
description: Diseñar e implementar componentes de interfaz, estilos Tailwind y branding institucional del Ministerio de Educación de San Juan (paleta oficial, accesibilidad WCAG, tablas y botones). Usar ante modificaciones visuales o de UI.
---

# 🎨 Workflow de Diseño, Branding e Interfaz (Ministerio de Educación)

Este workflow guía al desarrollador o agente de IA en la creación, modificación y estandarización visual de todos los componentes y vistas de la plataforma, asegurando el cumplimiento estricto del branding oficial del Ministerio de Educación de San Juan.

---

## 🎨 Paleta de Colores Oficial (Estricta)

Toda modificación visual debe utilizar la paleta de colores corporativa registrada en `tailwind.config.js`. Está estrictamente prohibido utilizar colores genéricos o estilos en línea.

| Color | Código HEX | Utilidad Tailwind | Propósito y Uso |
| :--- | :--- | :--- | :--- |
| **Naranja Institucional** | `#FE8204` | `bg-brand-orange`, `text-brand-orange`, `border-brand-orange` | Color primario. Se usa para botones principales, cabeceras de tablas (`<thead>`), iconos activos, enlaces destacados y bordes de enfoque. |
| **Rojo Alerta** | `#E43C2F` | `bg-brand-red`, `text-brand-red`, `border-brand-red` | Color secundario. Se usa para alertas de error, validaciones fallidas, estados críticos (`BAJA`, `ELIMINADO`), y botones destructivos. |
| **Amarillo Acento** | `#FADC3C` | `bg-brand-yellow`, `text-brand-yellow` | Color de acento. Se usa exclusivamente para estados intermedios o pendientes (`PENDIENTE`), advertencias preventivas, y detalles decorativos menores. |
| **Fondo Base** | `#FFFFFF` | `bg-white` | Fondo de la aplicación. Debe ser siempre blanco puro para mantener la limpieza institucional. Evitar fondos grises (`bg-gray-100`) en paneles. |
| **Texto de Alta Legibilidad**| `#000000` | `text-black` | Texto principal. **Debe ser negro puro** para cumplir rigurosamente con los estándares internacionales de accesibilidad WCAG AA. |

---

## 👥 Directrices de Contraste y Accesibilidad (WCAG)

> [!IMPORTANT]
> **Norma de Accesibilidad Crítica:**
> El Ministerio de Educación exige un contraste óptimo. Todo el texto primario sobre fondo blanco debe ser **negro puro (`#000000` / `text-black`)**.
> *   **Evitar:** Escalas de grises débiles (`text-gray-400`, `text-gray-500`) en textos informativos primarios o secundarios del layout.
> *   **Contraste sobre Naranja:** Al usar el color de fondo primario (`bg-brand-orange`), el texto superpuesto debe ser **blanco puro (`text-white`)** o **negro puro (`text-black`)** con un peso de fuente alto (`font-bold` o `font-black`) para asegurar legibilidad.

---

## 🏗️ Estructura del Layout y Componentes React

1.  **Fondo e Iluminación:**
    *   Los contenedores de páginas y tarjetas (`Cards`) deben utilizar `bg-white` con bordes sólidos finos de 1px en tonos muy claros o bordes naranjas sutiles (`border-brand-orange/20`).
    *   Evitar sombras genéricas oscuras (`shadow-xl`); priorizar bordes limpios y delimitados para un look moderno de "diseño plano institucional".

2.  **Cabeceras de Tablas:**
    *   Todas las tablas de datos (Auditoría, Edificios, Modalidades, Bitácora) deben tener sus cabeceras `<thead>` en color naranja de marca:
    ```jsx
    <thead className="bg-brand-orange text-white uppercase font-black text-xs tracking-wider">
        <tr>
            <th className="px-6 py-3 text-left">CUE / CUI</th>
            ...
        </tr>
    </thead>
    ```

3.  **Botones Comunes (React/Tailwind):**
    *   **Botón Primario:** Fondo naranja con efecto hover sutil y texto blanco:
        `className="bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-4 py-2 rounded-lg transition-colors border border-transparent shadow-sm font-sans text-sm"`
    *   **Botón Secundario (Peligro/Acción crítica):** Fondo rojo de alerta:
        `className="bg-brand-red hover:bg-brand-red/95 text-white font-bold px-4 py-2 rounded-lg transition-colors border border-transparent text-sm"`
    *   **Botón de Contorno (Outline):** Texto negro con borde naranja:
        `className="bg-white border border-brand-orange text-black hover:bg-brand-orange/5 px-4 py-2 rounded-lg transition-colors text-sm font-bold"`

---

## 📝 Lista de Verificación (Checklist) para Cambios Visuales

*   [ ] ¿El cambio utiliza las variables de color de `brand` de Tailwind en lugar de colores planos genéricos?
*   [ ] ¿El texto principal es negro puro (`text-black`) para cumplir con la norma de contraste?
*   [ ] ¿Las cabeceras de tablas son naranja institucional (`bg-brand-orange`) con texto blanco en negrita?
*   [ ] ¿El diseño es responsive en dispositivos móviles y de escritorio de forma nativa?
*   [ ] ¿Se removieron todos los estilos CSS en línea (`style={{...}}`) y se reemplazaron por clases de Tailwind?
*   [ ] ¿Los badges de estado respetan el código visual de la plataforma (Naranja = correcto, Rojo = baja/eliminado, Amarillo = pendiente)?
