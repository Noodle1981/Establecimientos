# 🏥 Establecimientos (Ministerio de Educación - San Juan)

Plataforma integral para la gestión, auditoría y visualización de establecimientos educativos (Estatales y Privados) de la Provincia de San Juan.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)
![Livewire](https://img.shields.io/badge/Livewire-3.x-4E56A6?style=for-the-badge&logo=livewire)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-blue?logo=sqlite)

## 🎯 Objetivos del Proyecto

1.  **Auditoría de Datos:** Verificación exhaustiva de la integridad y veracidad de la información de los establecimientos.
2.  **Control de Plataforma (EDÚGE):** Comparación y validación de los datos locales vs la plataforma externa EDÚGE para asegurar la consistencia (ej: verificar que el conteo de escuelas coincida).
3.  **Visualización Pública:** Estructura interactiva con mapas para que distintas áreas y oficinas del Ministerio puedan consultar la ubicación y datos de los establecimientos.

## 👥 Sistema de Roles y Accesos

| Rol | Acceso / Prefijo | Permisos |
| :--- | :--- | :--- |
| **Admin** | `/admin` | Gestión total, usuarios, configuración de sistema y auditoría. |
| **Administrativos** | `/administrativos` | Carga de datos, validación y gestión operativa. |
| **Público** | `/publicos` | Consulta de mapa y datos generales mediante interfaz pública. |

## 🛠️ Tecnologías Core

-   **Backend:** Laravel 12.x
-   **Frontend:** Livewire 3 (Componentes reactivos)
-   **Estilo:** Tailwind CSS (Diseño moderno)
-   **Base de Datos:** SQLite (Ligero y portátil)
-   **Layout:** Sidebar Top (Navegación optimizada)
-   **Autenticación:** Sistema integrado de Login y Registro.

## 📊 Especificación de Datos (Excel)

El sistema procesa archivos Excel con la siguiente estructura de columnas (26 campos):

1. `Direc. De Área`
2. `nivel_educativo`
3. `nombre`
4. `sector` (Estatal / Privado)
5. `cue`
6. `CUE Edificio Principal`
7. `establecimiento_cabecera`
8. `cui`
9. `calle`
10. `numero_puerta`
11. `orientacion`
12. `codigo_postal`
13. `localidad`
14. `latitud`
15. `longitud`
16. `categoria`
17. `Inst. Legal Categoría`
18. `Radio`
19. `Inst. Legal Radio`
20. `Inst. Legal Categoría` (Bis)
21. `Inst. Legal Creación`
22. `letra_zona`
23. `zona o departamento`
24. `TE VoIP`
25. `Ámbito`
26. `VALIDADO`

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
composer install
npm install

# 2. Configurar entorno
cp .env.example .env
php artisan key:generate

# 3. Migrar y sembrar (SQLite)
touch database/database.sqlite
php artisan migrate --seed

# 4. Compilar assets
npm run dev
```

## 📅 Roadmap de Desarrollo

Consultar el archivo [ROADMAP.md](ROADMAP.md) para ver el progreso de:
- [x] Rediseño de UI/UX
- [x] Estructura inicial de roles
- [/] Importador de Excel
- [ ] Mapa Interactivo Público
- [ ] Módulo de Auditoría vs EDÚGE
- [ ] Testing de Seguridad y Carga

---
*Este proyecto es parte de la modernización tecnológica del Ministerio de Educación de la Provincia de San Juan.*
