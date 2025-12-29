# Design System - Configuración del Proyecto

Este archivo contiene la configuración de diseño del proyecto. La IA debe consultar estos valores al crear nuevos componentes o vistas.

## 🎨 Colores del Proyecto

Los colores se obtienen dinámicamente de la base de datos (`project_settings` table) y se inyectan como CSS variables globales.

### Uso en código:

```php
// Obtener configuración
$config = \App\Services\ThemeService::getThemeConfig();

// Acceder a colores
$primaryColor = $config['primary_color'];    // Ejemplo: #8b5cf6
$secondaryColor = $config['secondary_color']; // Ejemplo: #ec4899
$accentColor = $config['accent_color'];       // Ejemplo: #3b82f6
```

### Uso en CSS/Tailwind:

```css
/* Las variables CSS están disponibles globalmente */
:root {
    --primary-color: #8b5cf6;
    --secondary-color: #ec4899;
    --accent-color: #3b82f6;
}

/* Usar en estilos inline */
<div style="background: var(--primary-color);">...</div>

/* Usar en gradientes */
<div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));">...</div>
```

## 📐 Layout Preferido

El layout preferido se guarda en la base de datos como referencia, pero NO se aplica automáticamente.

```php
$layoutType = \App\Models\ProjectSetting::get('layout_type', 'side-nav');
// Valores posibles: 'side-nav' | 'top-nav'
```

### Cuando crear nuevas vistas:

- **Si `layout_type` = 'side-nav'**: Crear componentes con navegación lateral
- **Si `layout_type` = 'top-nav'**: Crear componentes con navegación superior

## 🛠️ Cómo usar esta configuración

### Al crear un nuevo componente Blade:

1. **Lee los colores** de la configuración
2. **Usa las CSS variables** en lugar de colores hardcodeados
3. **Consulta el layout preferido** para decidir la estructura

### Ejemplo de componente nuevo:

```blade
<div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Usar gradiente con colores del tema -->
    <div class="h-24 rounded-t-lg" 
         style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));">
        <h3 class="text-white font-bold p-4">{{ $title }}</h3>
    </div>
    
    <!-- Botón con color primario -->
    <button class="px-4 py-2 rounded-lg text-white mt-4"
            style="background-color: var(--primary-color);">
        {{ $buttonText }}
    </button>
</div>
```

## 📝 Configuración Actual

Para ver la configuración actual del proyecto:

```bash
php artisan tinker
>>> App\Services\ThemeService::getThemeConfig()
```

## 🔄 Cambiar configuración

Los usuarios pueden cambiar la configuración visitando: `http://localhost:8000/setup`

Esto actualizará:
- ✅ Colores (se aplican automáticamente en todo el proyecto)
- ✅ Layout preferido (solo como referencia para la IA)
- ✅ Nombre de la aplicación
- ✅ Preferencia de Glassmorphism

## 🎯 Reglas para la IA

1. **SIEMPRE** usa `var(--primary-color)`, `var(--secondary-color)`, `var(--accent-color)` en lugar de colores hardcodeados
2. **CONSULTA** el `layout_type` antes de crear vistas complejas
3. **NO MODIFIQUES** layouts existentes automáticamente
4. **CREA** nuevos componentes siguiendo el layout preferido
