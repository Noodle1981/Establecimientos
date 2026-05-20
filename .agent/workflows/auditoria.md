---
description: Auditar inconsistencias con EDÚGE, validar estados de modalidades y propagar información compartida a nivel de edificio.
---

# 🛡️ Workflow de Auditoría y Validación de Estados (Fase 4)

Este workflow detalla la lógica de negocio y los flujos técnicos para auditar, conciliar y certificar la validez de los datos de establecimientos educativos del Ministerio de Educación.

---

## ⚙️ Máquina de Estados de Validación

Cada modalidad educativa (`modalidades`) atraviesa un ciclo de vida gobernado por estados:

1.  **`PENDIENTE`:** (Por defecto) Los datos fueron importados del Excel original pero no han sido revisados. Se muestra con badge **amarillo**.
2.  **`CORRECTO`:** El administrativo ha auditado la información y verificado que coincide plenamente con los registros físicos y ministeriales. Se muestra con badge **naranja**.
3.  **`CORREGIDO`:** El administrativo detectó errores en los datos originales (ej: dirección, nombre) y los ha corregido activamente en el sistema antes de validar. Se muestra con badge **azul/naranja**.
4.  **`BAJA`:** Establecimiento inactivo temporalmente o en proceso de cierre.
5.  **`ELIMINADO`:** Registro nulo, duplicado, o con error insalvable. Se muestra con badge **rojo** y tiene soporte de soft deletes.

---

## 🔄 Ejecución de Cambios de Estado y Bitácora Activa

Cualquier cambio de estado debe realizarse exclusivamente a través del método `cambiarEstado()` del modelo `Modalidad`. Está prohibido actualizar directamente la columna `estado_validacion` con `save()` plano, ya que se rompería el registro histórico de trazabilidad.

### Flujo de Código del Cambio de Estado:
```php
// En app/Models/Modalidad.php:
public function cambiarEstado(string $nuevoEstado, ?string $observaciones = null, ?int $userId = null, ?array $camposAuditados = null)
{
    $estadoAnterior = $this->estado_validacion;
    
    // 1. Actualizar el registro principal
    $this->estado_validacion = $nuevoEstado;
    $this->validado = true; // Pasa a ser validado
    $this->validado_por_user_id = $userId ?? Auth::id();
    $this->validado_en = now();
    $this->observaciones = $observaciones;
    $this->campos_auditados = $camposAuditados; // Array de campos chequeados
    $this->save();
    
    // 2. Registrar en la bitácora de historial
    $this->historialEstados()->create([
        'user_id' => $userId ?? Auth::id(),
        'estado_anterior' => $estadoAnterior,
        'estado_nuevo' => $nuevoEstado,
        'observaciones' => $observaciones,
        'campos_auditados' => $camposAuditados,
    ]);
}
```

---

## 🏢 Lógica Relacional de Propagación al Edificio

Un edificio físico (CUI único) alberga típicamente múltiples establecimientos (CUE) y modalidades. Cuando un administrativo corrige o valida datos del edificio físico en una modalidad (ej. Calle, Número, CP, Localidad, Latitud, Longitud), el sistema ofrece la opción **"Propagar al Edificio"**.

### Reglas de Negocio para Propagación:
1.  **Campos Compartidos (Edificio):** `['Dirección', 'Edificio', 'CUI', 'GPS']`.
2.  **Lógica:** Al marcarse la propagación, el sistema busca todas las otras modalidades de establecimientos que compartan el mismo `edificio_id`.
3.  **Acción:** Para cada una de las otras modalidades vinculadas:
    *   Mantiene intactos sus campos específicos individuales (ej. Radio, Categoría).
    *   Sincroniza y sobrescribe únicamente los campos de infraestructura compartidos que fueron auditados en esta validación.
    *   Registra de manera individual un cambio de estado en `historial_estados_modalidad` para cada una de las escuelas vinculadas, asegurando la auditoría de todo el edificio escolar de forma atómica.

---

## 📄 Generación de Informes y Exportación PDF

La plataforma permite descargar reportes completos del estado de auditoría en formato PDF.

*   **Motor:** `barryvdh/laravel-dompdf`.
*   **Orientación:** Apaisado (Landscape) para una óptima lectura de columnas de datos.
*   **Lógica en el Controlador (`AuditoriaController.php`):**
    *   Obtiene la query filtrada desde el `AuditoriaQueryService`.
    *   Carga la vista Blade de impresión: `resources/views/pdf/auditoria_reporte.blade.php`.
    *   Compila y retorna el stream de descarga de forma optimizada.

---

## 📝 Lista de Verificación (Checklist) para Auditoría

*   [ ] Al actualizar un estado, ¿se utilizó la función `$modalidad->cambiarEstado()` para escribir en la bitácora?
*   [ ] ¿Se está validando que el usuario que ejecuta la acción tiene rol de `admin` o `administrativo`?
*   [ ] En caso de propagación al edificio, ¿se recuperaron correctamente las modalidades vinculadas mediante `whereHas('establecimiento')` excluyendo el ID actual?
*   [ ] ¿Se envuelven las operaciones de propagación en una transacción (`DB::transaction`) para evitar corrupción si falla a mitad de camino?
*   [ ] ¿El PDF carga las relaciones `establecimiento.edificio` con eager loading para evitar problemas N+1 en bases de datos con cientos de filas?
