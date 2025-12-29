# Contexto del Proyecto - Establecimientos (M.E. San Juan)

Este archivo proporciona el contexto estratégico y técnico del proyecto para asistentes de IA.

## 📋 Descripción del Proyecto

**Establecimientos** es una plataforma diseñada para el Ministerio de Educación de la Provincia de San Juan. Su propósito es consolidar, auditar y visualizar la información de todos los establecimientos educativos (Estatales y Privados) de la provincia.

## 🎯 Objetivos Estratégicos

1.  **Auditoría de Datos:** Limpieza y validación de la base de datos de escuelas.
2.  **Control EDÚGE:** Sincronización y validación con la plataforma externa EDÚGE para asegurar que no falten ni sobren establecimientos en el sistema oficial.
3.  **Infraestructura Pública:** Mapa interactivo para que oficinas gubernamentales y ciudadanos localicen establecimientos.

## 👥 Roles y Permisos

| Rol | Prefijo de Ruta | Responsabilidad |
|-----|--------|-------------|
| `admin` | `/admin` | Configuración global, gestión de usuarios de alto nivel y auditoría. |
| `administrativos` | `/administrativos` | Carga masiva (Excel), validación de registros y corrección de datos. |
| `público` | `/publicos` | Acceso a mapas y búsqueda de escuelas sin autenticación. |

## 🛠️ Stack Tecnológico

### Backend & Logic
- **Laravel 12.x** (Framework principal)
- **Livewire 3.x** (Lógica reactiva para tablas, mapas e importación)
- **SQLite** (Motor de base de datos local y portable)

### Frontend
- **Tailwind CSS** (Diseño moderno, premium, glassmorphism)
- **Sidebar Top** (Layout de navegación superior/lateral)
- **Alpine.js** (Interactividad ligera)

## 📊 Estructura de Datos (Excel)

El sistema debe manejar un archivo Excel con 26 columnas específicas:
`Direc. De Area`, `nivel_educativo`, `nombre`, `sector`, `cue`, `CUE Edificio Principal`, `establecimiento_cabecera`, `cui`, `calle`, `numero_puerta`, `orientacion`, `codigo_postal`, `localidad`, `latitud`, `longitud`, `categoria`, `Inst. Legal Categoría`, `Radio`, `Inst. Legal Radio`, `Inst. Legal Categoría` (bis), `Inst. Legal Creación`, `letra_zona`, `zona o departamento`, `TE VoIP`, `Ámbito`, `VALIDADO`.

## 📁 Estructura de Carpetas

```
app/
├── Http/Controllers/SetupController.php # Configuración dinámica UI
├── Models/ProjectSetting.php            # Almacenamiento de temas/colores
├── Services/ThemeService.php            # Lógica de aplicación de estilo
database/
├── migrations/*_create_project_settings_table.php
resources/views/
├── setup/                               # Vistas de configuración
└── layouts/app.blade.php                # Layout principal Sidebar Top
```

## 📝 Convenciones de Guía IA

1. **Naming**: Usar español para conceptos de dominio (Establecimientos, Edificios, Auditoria) pero inglés para estructura técnica (Controller, Models).
2. **Estilo**: Siempre priorizar diseños "Premium" y modernos con Tailwind. No usar placeholders; generar imágenes reales si es necesario.
3. **Seguridad**: Rutas protegidas estrictamente por el middleware de roles.
4. **Git**: Commits descriptivos con prefijos (`feat:`, `fix:`, `docs:`).

---
**Última actualización:** 29 de diciembre de 2025  
**Contexto:** Rediseño inicial y configuración de objetivos del Ministerio.
