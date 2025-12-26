# Contexto del Proyecto - Laravel Boilerplate Starter Kit

Este archivo proporciona contexto completo del proyecto para asistentes de IA.

## 📋 Descripción del Proyecto

**Laravel Boilerplate Starter Kit** es un proyecto base para aplicaciones Laravel que incluye:

- Sistema de autenticación completo con Laravel Breeze + Livewire
- Sistema de roles simple (admin, mid, user)
- Middleware de autorización por roles
- Dashboards personalizados por rol
- Suite de testing completa
- Diseño moderno con Tailwind CSS

## 🎯 Objetivo

Proporcionar un punto de partida robusto y bien estructurado para nuevos proyectos Laravel, evitando reinventar la rueda en cada proyecto.

## 🛠️ Stack Tecnológico

### Backend
-  **Laravel 12.44.0**
- **PHP 8.2+**
- **Middleware personalizado**: CheckRole

### Frontend
- **Livewire 3.7.3** - Framework reactivo
- **Tailwind CSS 3.x** - Utility-first CSS
- **Alpine.js** - JavaScript framework (incluido con Livewire)

### Testing
- **PHPUnit 11.x**

### Base de Datos
- MySQL / PostgreSQL / SQLite (configurable)

## 📁 Estructura de Carpetas Clave

```
app/
├── Http/Middleware/CheckRole.php       # Middleware de roles
├── Livewire/                           # Componentes Livewire
│   ├── Admin/AdminDashboard.php
│   ├── Mid/MidDashboard.php
│   └── User/UserDashboard.php
└── Models/User.php                     # Modelo con helpers de roles

database/
├── migrations/*_add_role_to_users_table.php
└── seeders/RoleUsersSeeder.php

routes/
└── web.php                             # Rutas con middleware de roles

tests/
└── Feature/RoleAuthorizationTest.php   # 11 tests de autorización

resources/views/
├── welcome.blade.php                   # Landing page
└── livewire/                           # Vistas de componentes Livewire
    ├── admin/admin-dashboard.blade.php
    ├── mid/mid-dashboard.blade.php
    └── user/user-dashboard.blade.php
```

## 🔒 Sistema de Roles

### Roles Definidos

| Rol | Acceso | Descripción |
|-----|--------|-------------|
| `admin` | /admin, /mid, /dashboard | Acceso total al sistema |
| `mid` | /mid, /dashboard | Nivel intermedio |
| `user` | /dashboard | Usuario estándar |

### Implementación

- Campo `role` en tabla `users` (ENUM)
- Middleware `CheckRole` para proteger rutas
- Helpers en modelo User: `isAdmin()`, `isMid()`, `isUser()`, `hasRole()`

### Ejemplo de Uso

```php
// En rutas
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', AdminDashboard::class);
});

// En código
if (auth()->user()->isAdmin()) {
    // Lógica para admin
}
```

## 🧪 Testing

### Usuarios de Prueba

Ejecutar `php artisan db:seed` crea:

```
admin@example.com / password (rol: admin)
mid@example.com / password (rol: mid)
user@example.com / password (rol: user)
```

### Suite de Tests

- **RoleAuthorizationTest.php**: 11 tests que verifican:
  - Usuarios no autenticados no pueden acceder
  - Cada rol solo accede a sus rutas permitidas
  - Métodos helper funcionan correctamente

**Ejecutar tests:**
```bash
php artisan test --filter=RoleAuthorizationTest
```

## 🎨 Diseño y UI

### Tailwind CSS

- Dark mode incluido
- Diseño responsive
- Utility classes
- Componentes glassmorphism

### Dashboards

Cada rol tiene un dashboard único con:

- **Admin**: Estadísticas de usuarios, acciones administrativas
- **Mid**: Proyectos, tareas, actividad
- **User**: Perfil personal, información de cuenta

## 📝 Convenciones

### Naming

- **Componentes Livewire**: PascalCase (AdminDashboard.php)
- **Vistas Blade**: kebab-case (admin-dashboard.blade.php)
- **Rutas**: nombres descriptivos con prefijos de rol
- **Middleware**: CamelCase (CheckRole)

### Código

- PSR-12 para PHP
- DocBlocks en todos los métodos públicos
- Comentarios descriptivos en español

### Git

```bash
# Estructura de commits
feat: Añadir nueva funcionalidad
fix: Corregir bug
docs: Actualizar documentación
test: Añadir o modificar tests
style: Cambios de formato/estilo
refactor: Refactorización de código
```

## 🚀 Comandos Más Usados

### Desarrollo

```bash
# Servidor de desarrollo
php artisan serve

# Compilar assets (modo watch)
npm run dev

# Ejecutar tests
php artisan test

# Ver rutas
php artisan route:list
```

### Base de Datos

```bash
# Migrar
php artisan migrate

# Resetear con seeders
php artisan migrate:fresh --seed

# Crear seeder
php artisan make:seeder NombreSeeder
```

### Livewire

```bash
# Crear componente
php artisan make:livewire NombreComponente

# Crear componente en subdirectorio
php artisan make:livewire Admin/NuevoComponente
```

## 📚 Documentación Adicional

- [setup.md](../doc/setup.md) - Guía de instalación
- [architecture.md](../doc/architecture.md) - Arquitectura detallada
- [roles-system.md](../doc/roles-system.md) - Sistema de roles
- [testing-guide.md](../doc/testing-guide.md) - Guía de testing

## 🔧 Resolución de Problemas Comunes

### Error: "No application encryption key"
```bash
php artisan key:generate
```

### Assets no cargan
```bash
npm run build
```

### Tests fallan
- Verificar configuración de DB en `phpunit.xml`
- Asegurarse de que las migraciones se ejecuten

### Error 403 en rutas
- Verificar que el usuario tenga el rol correcto
- Revisar la definición del middleware en la ruta

## 💡 Próximas Mejoras Sugeridas

### Funcionalidades

- [ ] CRUD de usuarios para admin
- [ ] Panel de gestión de roles
- [ ] Sistema de permisos granulares (Spatie Permission)
- [ ] API con Laravel Sanctum
- [ ] Logs de actividad (Activity Log)

### UI/UX

- [ ] Notificaciones con Livewire
- [ ] Modales reutilizables
- [ ] Componentes de formularios
- [ ] Paginación estilizada

### Testing

- [ ] Tests de componentes Livewire
- [ ] Tests de API (si se implementa)
- [ ] Test coverage al 80%+

## 🤝 Contribución

Al trabajar en este proyecto:

1. Mantener la estructura de carpetas
2. Seguir las convenciones de naming
3. Agregar tests para nuevas funcionalidades
4. Actualizar documentación relevante
5. Usar Tailwind para estilos (evitar CSS personalizado)

## 📞 Soporte

Para cualquier duda sobre la arquitectura o implementación:
- Revisar primero la documentación en `/doc`
- Verificar tests en `/tests/Feature`
- Consultar rutas en `routes/web.php`

---

**Última actualización:** 26 de diciembre de 2025  
**Versión de Laravel:** 12.44.0  
**Versión de Livewire:** 3.7.3
