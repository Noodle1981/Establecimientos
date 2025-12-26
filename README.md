# 🚀 Laravel Boilerplate Starter Kit

Un starter kit robusto y moderno para proyectos Laravel con **Livewire 3**, **Tailwind CSS** y sistema de roles integrado.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)
![Livewire](https://img.shields.io/badge/Livewire-3.x-4E56A6?style=for-the-badge&logo=livewire)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php)

## ✨ Características

- ✅ **Autenticación Completa** - Laravel Breeze con Livewire
- ✅ **Sistema de Roles** - Admin, Mid y User con middleware personalizado
- ✅ **Dashboards Personalizados** - Vista única para cada rol
- ✅ **Gestión de Usuarios** - CRUD completo para administradores
- ✅ **Componentes UI Nativos** - Toast, Alert, Card, Modal, Button con loading
- ✅ **Sistema de Notificaciones** - Toast messages con flash y eventos Livewire
- ✅ **Testing Suite** - 22 tests automatizados (11 roles + 11 gestión usuarios)
- ✅ **Diseño Moderno** - Tailwind CSS con dark mode y plugins oficiales
- ✅ **Componentes Livewire** - Arquitectura reactiva sin dependencias externas
- ✅ **Documentación Completa** - Guías detalladas en `/doc`

## 🎨 Componentes UI Disponibles

### Componentes Nativos

Todos construidos sin dependencias externas, solo Tailwind + Alpine.js:

**Toast Notifications**
```blade
<!-- Auto-trigger desde sesión -->
return redirect()->route('dashboard')->with('success', '¡Operación exitosa!');

<!-- Desde Livewire -->
$this->dispatch('notify', type: 'success', message: 'Usuario actualizado');
```

**Alerts**
```blade
<x-alert type="success">Operación completada correctamente</x-alert>
<x-alert type="error" dismissible>Ocurrió un error</x-alert>
<x-alert type="warning">Advertencia importante</x-alert>
<x-alert type="info">Información útil</x-alert>
```

**Cards**
```blade
<x-card title="Título del Card">
    Contenido del card
</x-card>

<x-card>
    <x-slot name="title">Título Custom</x-slot>
    <x-slot name="footer">
        <button>Acción</button>
    </x-slot>
    Contenido
</x-card>
```

**Modal**
```blade
<x-modal name="confirm-delete" :show="$showModal">
    <div class="p-6">
        <h2>¿Confirmar acción?</h2>
        <!-- contenido -->
    </div>
</x-modal>
```

**Button con Loading**
```blade
<x-primary-button :loading="$isProcessing" loadingText="Procesando...">
    Guardar
</x-primary-button>
```

## 🎯 Casos de Uso

Este boilerplate es perfecto para:

- Aplicaciones web con diferentes niveles de acceso
- Dashboards administrativos
- Sistemas de gestión
- Aplicaciones SaaS
- Proyectos que necesitan autenticación robusta

## 🚀 Instalación Rápida

```bash
# 1. Clonar/Copiar el proyecto
cd tu-proyecto

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos en .env
# DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# 5. Migrar y sembrar datos
php artisan migrate --seed

# 6. Compilar assets
npm run build

# 7. Iniciar servidor
php artisan serve
```

Visita `http://localhost:8000` y listo! 🎉

## 👤 Usuarios de Prueba

El seeder crea automáticamente estos usuarios:

| Usuario | Email | Contraseña | Rol | Acceso |
|---------|-------|-----------|-----|--------|
| Admin | `admin@example.com` | `password` | admin | /admin, /mid, /dashboard |
| Mid | `mid@example.com` | `password` | mid | /mid, /dashboard |
| User | `user@example.com` | `password` | user | /dashboard |

## 🏗️ Estructura del Proyecto

```
base_laravel/
├── app/
│   ├── Http/Middleware/CheckRole.php      # Middleware de roles
│   ├── Livewire/                          # Componentes Livewire
│   │   ├── Admin/AdminDashboard.php
│   │   ├── Mid/MidDashboard.php
│   │   └── User/UserDashboard.php
│   └── Models/User.php                    # Modelo con helpers
├── database/
│   ├── migrations/                        # Incluye migración de roles
│   └── seeders/RoleUsersSeeder.php        # Usuarios de prueba
├── resources/views/
│   ├── livewire/                          # Vistas de componentes
│   └── welcome.blade.php                  # Landing page
├── routes/web.php                         # Rutas con middleware
├── tests/Feature/
│   └── RoleAuthorizationTest.php          # 11 tests
├── doc/                                   # Documentación
│   ├── setup.md
│   ├── architecture.md
│   ├── roles-system.md
│   └── testing-guide.md
└── .agent/workflows/context.md            # Contexto para IA
```

## 🔒 Sistema de Roles

### Implementación Simple

El sistema usa un campo `role` en la tabla `users` (ENUM):

```php
// Migración
$table->enum('role', ['admin', 'mid', 'user'])->default('user');

// Proteger rutas
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', AdminDashboard::class);
});

// Helpers en código
if (auth()->user()->isAdmin()) {
    // Lógica para admin
}
```

### Métodos Helper

```php
$user->isAdmin();          // bool
$user->isMid();            // bool
$user->isUser();           // bool
$user->hasRole('admin');   // bool
$user->hasRole(['admin', 'mid']); // bool
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
php artisan test

# Solo tests de autorización
php artisan test --filter=RoleAuthorizationTest

# Con cobertura
php artisan test --coverage
```

**Tests incluidos:**
- ✅ Usuarios no autenticados no pueden acceder (3 tests)
- ✅ Role 'user' solo accede a /dashboard (3 tests)
- ✅ Role 'mid' accede a /mid y /dashboard (3 tests)
- ✅ Role 'admin' accede a todo (3 tests)
- ✅ Métodos helper funcionan correctamente (1 test)

## 🎨 Personalización

### Agregar un Nuevo Rol

1. **Actualizar migración:**
```php
$table->enum('role', ['admin', 'mid', 'user', 'nuevo_rol']);
```

2. **Agregar helper en User.php:**
```php
public function isNuevoRol(): bool {
    return $this->role === 'nuevo_rol';
}
```

3. **Crear componente Livewire:**
```bash
php artisan make:livewire NuevoRol/NuevoRolDashboard
```

4. **Agregar ruta:**
```php
Route::middleware(['role:nuevo_rol'])->group(function () {
    Route::get('/nuevo-rol', NuevoRolDashboard::class);
});
```

5. **Agregar tests!**

## 📚 Documentación

- **[Guía de Instalación](doc/setup.md)** - Instalación detallada paso a paso
- **[Arquitectura](doc/architecture.md)** - Estructura y diseño del proyecto
- **[Sistema de Roles](doc/roles-system.md)** - Detalles del sistema de autorización
- **[Guía de Testing](doc/testing-guide.md)** - Cómo escribir y ejecutar tests

## 🛠️ Comandos Útiles

```bash
# Desarrollo
php artisan serve              # Servidor local
npm run dev                    # Compilar assets (watch)
php artisan route:list         # Ver rutas

# Base de datos
php artisan migrate:fresh --seed  # Resetear DB
php artisan db:seed              # Solo seeders

# Testing
php artisan test                 # Ejecutar tests
php artisan test --parallel      # Tests en paralelo

# Optimización
php artisan optimize             # Optimizar app
npm run build                    # Build producción
```

## 🔧 Tecnologías

- **Laravel 12.44.0** - Framework PHP
- **Livewire 3.7.3** - Componentes reactivos
- **Alpine.js** - Interactividad JavaScript
- **Tailwind CSS 3.x** - Utility-first CSS
- **Laravel Breeze** - Autenticación
- **PHPUnit 11.x** - Testing
- **Vite** - Asset bundling

## 📝 Roadmap

- [x] Panel de gestión de usuarios (Admin)
- [x] CRUD completo de usuarios
- [x] Sistema de notificaciones Toast
- [x] Componentes UI reutilizables
- [ ] Permisos granulares con Spatie Permission
- [ ] API con Laravel Sanctum
- [ ] Logs de actividad
- [ ] Notificaciones en tiempo real
- [ ] Exportación de reportes

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `test:` Agregar/modificar tests
- `refactor:` Refactorización
- `style:` Cambios de formato

## 📄 Licencia

Este proyecto es open source y está disponible bajo la [MIT License](LICENSE).

## 💬 Soporte

¿Encontraste un bug? ¿Tienes una sugerencia?

- 📫 Abre un [Issue](../../issues)
- 📖 Lee la [Documentación](doc/)
- 💬 Inicia una [Discussion](../../discussions)

## ⭐ Agradecimientos

Este boilerplate fue construido con:

- [Laravel](https://laravel.com) - El framework PHP
- [Livewire](https://livewire.laravel.com) - Componentes reactivos
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Laravel Breeze](https://laravel.com/docs/breeze) - Autenticación

---

