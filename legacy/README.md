# Sistema de Gestión de Establecimientos M.E.

Plataforma integral para la gestión, geolocalización y auditoría de establecimientos educativos del Ministerio de Educación.

## 🚀 Características Principales

- **Mapa Interactivo**: Visualización geolocalizada de edificios y establecimientos educativos con filtros avanzados.
- **Gestión Administrativa**: Control total sobre Edificios, Establecimientos, Usuarios y Modalidades.
- **Módulo de Auditoría EDUGE**: Herramienta avanzada para la reconciliación de datos entre la plataforma local y el sistema oficial EDUGE.
- **Reportes PDF**: Generación automática de informes de auditoría individuales y globales/trimestrales.
- **Roles y Permisos**: Sistema granular de accesos para Admin, Administrativos, Técnicos y Público general.
- **Interfaz Premium**: Diseño moderno basado en Tailwind CSS, Alpine.js y Livewire con estética Glassmorphism.

## 🛠️ Stack Tecnológico

- **Backend**: Laravel 11.x
- **Frontend**: Livewire 3.x, Alpine.js, Tailwind CSS
- **Base de Datos**: MySQL / SQLite
- **Reportes**: Barryvdh/laravel-dompdf
- **Geocodificación**: Integración con Leaflet.js

## 📦 Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repo-url>
   ```
2. Instalar dependencias:
   ```bash
   composer install
   ```
3. Configurar el archivo `.env`:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Ejecutar migraciones y seeders:
   ```bash
   php artisan migrate --seed
   ```
5. Iniciar el servidor:
   ```bash
   php artisan serve
   ```

## 📋 Auditoría EDUGE

El sistema permite realizar un cotejo de datos sistemático:
1. Selección de establecimiento o reporte de faltante.
2. Identificación de discrepancias (Campo, Valor Sistema, Valor EDUGE).
3. Generación inmediata de comprobante PDF.
4. Historial completo con filtros por auditor y fecha.

---
© 2025 Ministerio de Educación - San Juan.
