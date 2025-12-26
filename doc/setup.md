# Laravel Boilerplate Starter Kit - Guía de Instalación

Esta guía te ayudará a configurar el proyecto desde cero.

## Requisitos Previos

- PHP 8.2 o superior
- Composer
- Node.js y NPM
- Base de datos (MySQL, PostgreSQL, o SQLite)

## Instalación Paso a Paso

### 1. Clonar o Copiar el Repositorio

```bash
# Si estás clonando desde Git
git clone <url-del-repositorio>
cd base_laravel

# O simplemente copiar la carpeta completa
```

### 2. Instalar Dependencias de PHP

```bash
composer install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Generar la clave de aplicación
php artisan key:generate
```

### 4. Configurar la Base de Datos

Editar el archivo `.env` y configurar la conexión a la base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_boilerplate
DB_USERNAME=root
DB_PASSWORD=
```

**Alternativa con SQLite** (más simple para desarrollo):

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

Si usas SQLite, crear el archivo de base de datos:

```bash
touch database/database.sqlite
```

### 5. Ejecutar Migraciones y Seeders

```bash
# Ejecutar las migraciones
php artisan migrate

# Ejecutar los seeders para crear usuarios de prueba
php artisan db:seed
```

Esto creará los siguientes usuarios de prueba:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@example.com | password | admin |
| mid@example.com | password | mid |
| user@example.com | password | user |

### 6. Instalar Dependencias de Node.js

```bash
npm install
```

### 7. Compilar Assets

**Para desarrollo:**
```bash
npm run dev
```

**Para producción:**
```bash
npm run build
```

### 8. Iniciar el Servidor de Desarrollo

```bash
php artisan serve
```

La aplicación estará disponible en: `http://localhost:8000`

## Verificación de la Instalación

1. Visita `http://localhost:8000` - Deberías ver la pantalla de bienvenida
2. Haz clic en "Login"
3. Inicia sesión con:
   - **Email:** `admin@example.com`
   - **Contraseña:** `password`
4. Deberías ser redirigido a `/dashboard`

## Testing

Ejecutar la suite de tests completa:

```bash
php artisan test
```

Ejecutar solo tests de autorización:

```bash
php artisan test --filter=RoleAuthorizationTest
```

## Comandos Útiles

### Limpiar Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Optimizar para Producción

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Resetear Base de Datos

```bash
# Precaución: Esto eliminará todos los datos
php artisan migrate:fresh --seed
```

## Solución de Problemas

### Error: "No application encryption key has been specified"

```bash
php artisan key:generate
```

### Error de permisos en storage/

```bash
chmod -R 775 storage bootstrap/cache
```

### Assets no cargan (404)

```bash
npm run build
php artisan storage:link
```

### Tests fallan

Asegúrate de tener configurada la base de datos de testing en `phpunit.xml`:

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

## Próximos Pasos

- Revisa la [Arquitectura del Proyecto](architecture.md)
- Lee la documentación del [Sistema de Roles](roles-system.md)
- Consulta la [Guía de Testing](testing-guide.md)

---

**¿Problemas?** Revisa los logs en `storage/logs/laravel.log`
