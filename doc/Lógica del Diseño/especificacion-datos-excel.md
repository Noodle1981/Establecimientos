# Especificación Técnica de Datos - Excel Establecimientos

## Resumen del Archivo

- **Nombre:** `Establecimientos_Publicos.xlsx`
- **Total Registros:** 1,167 establecimientos
- **Columnas:** 26 campos útiles + 1 vacía
- **Tipo:** Establecimientos educativos estatales de San Juan

## Análisis de Campos

### Identificadores Únicos

| Campo | Tipo | Único | Descripción |
|-------|------|-------|-------------|
| `cue` | bigint | ✅ | Código Único de Establecimiento (identifica cada escuela) |
| `cui` | bigint | ✅ | Código Único de Inmueble (identifica cada edificio físico) |

**Relación:** Varios establecimientos pueden compartir el mismo CUI (mismo edificio).

### Campos de Ubicación

| Campo | Tipo | Nullable | Ejemplo | Notas |
|-------|------|----------|---------|-------|
| `calle` | string | ❌ | "MAESTRA ACIAR Y MAESTRO ANEA" | |
| `numero_puerta` | string | ✅ | "S/N", "123" | Puede ser "S/N" |
| `orientacion` | string | ✅ | "S/N" | Orientación del edificio |
| `codigo_postal` | integer | ✅ | 5419 | |
| `localidad` | string | ❌ | "CAMPO AFUERA" | |
| `latitud` | string | ❌ | "-31,4223061" | ⚠️ Formato con coma |
| `longitud` | string | ❌ | "-68,5461207" | ⚠️ Formato con coma |
| `letra_zona` | string | ✅ | "S" | |
| `zona o departamento` | string | ❌ | "ALBARDON" | |

**Importante:** Las coordenadas vienen con coma decimal (formato europeo), deben convertirse a punto decimal para la BD.

### Campos de Clasificación

| Campo | Tipo | Valores Posibles |
|-------|------|------------------|
| `Direc. De Área` | string | "ADULTOS", "PRIMARIO", "TÉCNICA", "INICIAL", etc. |
| `nivel_educativo` | string | "UEPA", "PRIMARIO", "TEC. CAP. LABORAL", "SECUNDARIO", etc. |
| `categoria` | string | "PRIMERA", "SEGUNDA", "TERCERA" |
| `Ámbito` | string | "PUBLICO", "PRIVADO" |

### Campos Administrativos

| Campo | Tipo | Ejemplo | Notas |
|-------|------|---------|-------|
| `nombre` | string | "NOCTURNA JUAN E. SERU" | Nombre del establecimiento |
| `sector` | integer | 204, 484, 497 | Código de sector administrativo |
| `establecimiento_cabecera` | string | "VILLICUM" | Establecimiento principal |
| `CUE Edificio Principal` | bigint | 700038100 | CUE del edificio donde funciona |

### Campos Legales

| Campo | Tipo | Ejemplo | Notas |
|-------|------|---------|-------|
| `Inst. Legal Categoría` | string/null | null, "COMPLETAR" | Instrumento legal de categoría |
| `Radio` | float | 3.0 | Radio de cobertura |
| `Inst. Legal Radio` | string | "1943-ME-2005" | Instrumento legal del radio |
| `Inst. Legal Categoría` (bis) | string | "COMPLETAR" | ⚠️ Duplicado de columna 17 |
| `Inst. Legal Creación` | string | "COMPLETAR" | Instrumento de creación |

### Campos de Contacto

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `TE VoIP` | float | 4307748.0 | Teléfono VoIP |

### Campos de Estado

| Campo | Tipo | Valores |
|-------|------|---------|
| `VALIDADO` | string | "VALIDADO", "PENDIENTE", etc. |

## Estrategia de Importación

### 1. Normalización de Datos

```php
// Coordenadas: coma -> punto
$latitud = (float) str_replace(',', '.', $row['latitud']);
$longitud = (float) str_replace(',', '.', $row['longitud']);

// Validado: string -> boolean
$validado = $row['VALIDADO'] === 'VALIDADO';

// Ámbito: normalizar
$ambito = strtoupper(trim($row['Ámbito']));
```

### 2. Creación de Edificios

**Lógica:** Crear edificio si no existe un registro con el mismo CUI.

```php
$edificio = Edificio::firstOrCreate(
    ['cui' => $row['cui']],
    [
        'calle' => $row['calle'],
        'numero_puerta' => $row['numero_puerta'],
        'orientacion' => $row['orientacion'],
        'codigo_postal' => $row['codigo_postal'],
        'localidad' => $row['localidad'],
        'latitud' => $latitud,
        'longitud' => $longitud,
        'letra_zona' => $row['letra_zona'],
        'zona_departamento' => $row['zona o departamento'],
        'te_voip' => $row['TE VoIP'],
    ]
);
```

### 3. Creación de Establecimientos

```php
Establecimiento::create([
    'edificio_id' => $edificio->id,
    'cue' => $row['cue'],
    'cue_edificio_principal' => $row['CUE Edificio Principal'],
    'direccion_area' => $row['Direc. De Área'],
    'nivel_educativo' => $row['nivel_educativo'],
    'nombre' => $row['nombre'],
    'sector' => $row['sector'],
    'establecimiento_cabecera' => $row['establecimiento_cabecera'],
    'categoria' => $row['categoria'],
    'inst_legal_categoria' => $row['Inst. Legal Categoría'],
    'radio' => $row['Radio'],
    'inst_legal_radio' => $row['Inst. Legal Radio'],
    'inst_legal_categoria_bis' => $row['Inst. Legal Categoría'], // columna 20
    'inst_legal_creacion' => $row['Inst. Legal Creación'],
    'ambito' => $ambito,
    'validado' => $validado,
]);
```

## Validaciones Requeridas

### Críticas (Bloquean importación)
- ✅ CUE no puede ser nulo
- ✅ CUI no puede ser nulo
- ✅ CUE debe ser único
- ✅ Coordenadas deben ser válidas (rango de San Juan)
- ✅ Ámbito debe ser "PUBLICO" o "PRIVADO"

### Advertencias (Permiten importación)
- ⚠️ Campos "COMPLETAR" → marcar para revisión
- ⚠️ Coordenadas fuera de rango → marcar para auditoría
- ⚠️ Campos nulos opcionales → registrar en log

## Ejemplo de Registro Completo

```json
{
  "Direc. De Área": "ADULTOS",
  "nivel_educativo": "UEPA",
  "nombre": "NOCTURNA JUAN E. SERU",
  "sector": 204,
  "cue": 700038000,
  "CUE Edificio Principal": 700038100,
  "establecimiento_cabecera": "VILLICUM",
  "cui": 7000001,
  "calle": "MAESTRA ACIAR Y MAESTRO ANEA",
  "numero_puerta": "S/N",
  "orientacion": "S/N",
  "codigo_postal": 5419,
  "localidad": "CAMPO AFUERA",
  "latitud": "-31,4223061",
  "longitud": "-68,5461207",
  "categoria": "TERCERA",
  "Inst. Legal Categoría": null,
  "Radio": 3.0,
  "Inst. Legal Radio": "1943-ME-2005",
  "Inst. Legal Categoría (bis)": "COMPLETAR",
  "Inst. Legal Creación": "COMPLETAR",
  "letra_zona": "S",
  "zona o departamento": "ALBARDON",
  "TE VoIP": 4307748.0,
  "Ámbito": "PUBLICO",
  "VALIDADO": "VALIDADO"
}
```

---
**Generado:** 29 de diciembre de 2025  
**Fuente:** Análisis de `Establecimientos_Publicos.xlsx`
