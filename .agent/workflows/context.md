# Contexto del Proyecto - Establecimientos (M.E. San Juan)

## 📋 Descripción del Proyecto

**Establecimientos** es una plataforma integral para el Ministerio de Educación de San Juan que gestiona, audita y visualiza información de 1167+ establecimientos educativos estatales y privados.

## 🎯 Objetivos Estratégicos

1. **Auditoría de Datos:** Validación y limpieza de la base de datos de establecimientos educativos.
2. **Control EDÚGE:** Comparación con la plataforma externa EDÚGE para verificar consistencia (ej: si hay 1000 escuelas en BD, debe haber 1000 en EDÚGE).
3. **Visualización Pública:** Mapa interactivo para que oficinas del Ministerio y ciudadanos consulten ubicaciones y datos.

## 👥 Sistema de Roles

| Rol | Ruta | Permisos |
|-----|------|----------|
| `admin` | `/admin` | Gestión total: usuarios, configuración, auditoría completa |
| `administrativos` | `/administrativos` | Carga Excel, validación, corrección de datos |
| `publico` | `/publicos` | Consulta de mapa y datos (sin autenticación) |

## 📊 Estructura de Datos del Excel

### Archivo: `Establecimientos_Publicos.xlsx`
- **Total registros:** 1167 establecimientos
- **Columnas:** 26 campos + 1 vacía

### Campos y Tipos de Datos

| # | Campo | Tipo | Ejemplo | Notas |
|---|-------|------|---------|-------|
| 1 | `Direc. De Área` | string | "ADULTOS", "PRIMARIO", "TÉCNICA" | Nivel administrativo |
| 2 | `nivel_educativo` | string | "UEPA", "PRIMARIO", "TEC. CAP. LABORAL" | Tipo de educación |
| 3 | `nombre` | string | "NOCTURNA JUAN E. SERU" | Nombre del establecimiento |
| 4 | `sector` | integer | 204, 484, 497 | Código de sector |
| 5 | `cue` | bigint | 700038000 | **CUE del establecimiento** (único) |
| 6 | `CUE Edificio Principal` | bigint | 700038100 | CUE del edificio donde funciona |
| 7 | `establecimiento_cabecera` | string | "VILLICUM" | Establecimiento principal |
| 8 | `cui` | bigint | 7000001 | **CUI del edificio** (único por edificio) |
| 9 | `calle` | string | "MAESTRA ACIAR Y MAESTRO ANEA" | Dirección |
| 10 | `numero_puerta` | string | "S/N", "123" | Número o S/N |
| 11 | `orientacion` | string | "S/N" | Orientación del edificio |
| 12 | `codigo_postal` | integer | 5419 | CP |
| 13 | `localidad` | string | "CAMPO AFUERA" | Localidad |
| 14 | `latitud` | string | "-31,4223061" | Coordenada (formato con coma) |
| 15 | `longitud` | string | "-68,5461207" | Coordenada (formato con coma) |
| 16 | `categoria` | string | "PRIMERA", "TERCERA" | Categoría del establecimiento |
| 17 | `Inst. Legal Categoría` | string/null | null, "COMPLETAR" | Instrumento legal |
| 18 | `Radio` | float | 3.0 | Radio de cobertura |
| 19 | `Inst. Legal Radio` | string | "1943-ME-2005" | Instrumento legal del radio |
| 20 | `Inst. Legal Categoría` (bis) | string | "COMPLETAR" | Duplicado (revisar) |
| 21 | `Inst. Legal Creación` | string | "COMPLETAR" | Instrumento de creación |
| 22 | `letra_zona` | string | "S" | Zona alfabética |
| 23 | `zona o departamento` | string | "ALBARDON" | Departamento |
| 24 | `TE VoIP` | float | 4307748.0 | Teléfono VoIP |
| 25 | `Ámbito` | string | "PUBLICO" | Público/Privado |
| 26 | `VALIDADO` | string | "VALIDADO" | Estado de validación |

### Relaciones Clave

> [!IMPORTANT]
> **Jerarquía de 3 Niveles:**

**Nivel 1: Edificio (CUI)**
- **CUI (Código Único de Inmueble):** Identifica cada edificio físico.
- Un edificio puede albergar múltiples establecimientos.

**Nivel 2: Establecimiento (CUE)**
- **CUE (Código Único de Establecimiento):** Identifica cada institución educativa.
- Un establecimiento puede tener múltiples modalidades (niveles educativos).

**Nivel 3: Modalidad (cada fila del Excel)**
- Cada fila del Excel representa una **modalidad** específica de un establecimiento.
- Una modalidad se define por: `direccion_area` + `nivel_educativo` (ej: "PRIMARIO", "SECUNDARIO", "INICIAL", "ADULTOS").

**Ejemplo Real del Excel:**

```
Edificio: CUI 7000001 (Calle "MAESTRA ACIAR Y MAESTRO ANEA")
  └── Establecimiento: CUE 700060500 ("ESCUELA NORMAL SUPERIOR GRAL. SAN MARTIN")
        ├── Modalidad 1: PRIMARIO
        ├── Modalidad 2: SECUNDARIO
        ├── Modalidad 3: INICIAL
        └── Modalidad 4: ADULTOS
```

**Estadísticas del Excel:**
- **1,167 modalidades** (filas totales)
- **~1,150 establecimientos únicos** (CUEs únicos)
- **~100 edificios únicos** (CUIs únicos)
- **14 CUEs con modalidades múltiples** (ej: CUE 700060500 tiene 4 modalidades)

## 🏗️ Arquitectura de Base de Datos

### Tablas Principales

#### `edificios`
```sql
- id (PK)
- cui (unique, bigint)
- calle
- numero_puerta
- orientacion
- codigo_postal
- localidad
- latitud (decimal)
- longitud (decimal)
- letra_zona
- zona_departamento
- te_voip
- timestamps
```

#### `establecimientos`
```sql
- id (PK)
- edificio_id (FK -> edificios)
- cue (unique, bigint)
- cue_edificio_principal (bigint)
- direccion_area
- nivel_educativo
- nombre
- sector
- establecimiento_cabecera
- categoria
- inst_legal_categoria
- radio
- inst_legal_radio
- inst_legal_categoria_bis
- inst_legal_creacion
- ambito (ENUM: 'PUBLICO', 'PRIVADO')
- validado (boolean)
- timestamps
```

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 12.x
- **Frontend:** Livewire 3.x + Tailwind CSS
- **Base de Datos:** SQLite
- **Layout:** Sidebar Top
- **Importación:** PhpSpreadsheet / Laravel Excel
- **Mapas:** Leaflet / MapLibre GL JS

## 📝 Reglas de Negocio

### Importación de Excel
1. Validar que CUE sea único por establecimiento
2. Validar que CUI sea único por edificio
3. Convertir coordenadas de formato "," a "." (decimal)
4. Crear edificio si no existe (basado en CUI)
5. Asociar establecimiento al edificio correspondiente
6. Marcar registros con datos faltantes como "PENDIENTE DE VALIDACIÓN"

### Validación de Datos
- **Coordenadas:** Deben estar en rango válido para San Juan
- **CUE/CUI:** No pueden ser nulos
- **Ámbito:** Solo "PUBLICO" o "PRIVADO"
- **Campos "COMPLETAR":** Marcar para auditoría

## 🎨 Convenciones de Desarrollo

### Naming
- **Modelos:** `Establecimiento`, `Edificio` (español, singular)
- **Controladores:** `EstablecimientoController` (inglés + español)
- **Vistas:** `establecimientos/index.blade.php` (español, plural)
- **Rutas:** `/admin/establecimientos`, `/publicos/mapa`

### Diseño UI
- **Premium y Moderno:** Glassmorphism, gradientes, micro-animaciones
- **Responsive:** Mobile-first
- **Accesibilidad:** Contraste adecuado, labels descriptivos

### Git
```bash
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Documentación
refactor: Refactorización
test: Tests
```

## 🚀 Comandos Clave

```bash
# Desarrollo
php artisan serve
npm run dev

# Migraciones
php artisan migrate:fresh --seed

# Importar Excel
php artisan import:establecimientos Establecimientos_Publicos.xlsx

# Tests
php artisan test
```

## 📚 Documentación de Referencia

- [contextodelproyecto.md](../doc/contextodelproyecto.md) - Objetivos originales
- [tipos_de_columnas.md](../doc/tipos_de_columnas.md) - Especificación de columnas
- [ROADMAP.md](../ROADMAP.md) - Plan de desarrollo

---
**Última actualización:** 29 de diciembre de 2025  
**Datos:** 1167 establecimientos educativos de San Juan
