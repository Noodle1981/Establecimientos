<?php
use App\Models\Modalidad;
use Illuminate\Support\Facades\DB;

$crashObservation = 'SE ACTUALIZO CUI';
$crashStart = '2026-04-07 14:20:00';
$crashEnd = '2026-04-07 14:35:00';

$mods = Modalidad::where('updated_at', '>=', $crashStart)
                ->where('updated_at', '<=', $crashEnd)
                ->where('observaciones', $crashObservation)
                ->get();

$restoredCount = 0;
$skippedCount = 0;

DB::beginTransaction();

try {
    foreach ($mods as $m) {
        // Encontrar el último historial VÁLIDO (antes del crash o que no tenga la obs de error)
        $history = DB::table('historial_estados_modalidad')
            ->where('modalidad_id', $m->id)
            ->where('observaciones', '!=', $crashObservation)
            ->where('created_at', '<', $crashStart)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($history) {
            // Restaurar a estado y observación previa
            $m->estado_validacion = $history->estado_nuevo;
            $m->observaciones = $history->observaciones;
        } else {
            // Si no hay historial previo, asumimos estado inicial PENDIENTE sin obs
            $m->estado_validacion = 'PENDIENTE';
            $m->observaciones = null;
        }

        // Limpieza de campos de validación erróneos
        $m->validado = ($m->estado_validacion !== 'PENDIENTE');
        if ($m->estado_validacion === 'PENDIENTE') {
            $m->validado_en = null;
            $m->validado_por_user_id = null;
        }
        
        $m->save();

        // Borrar historiales "envenenados" de hoy
        DB::table('historial_estados_modalidad')
            ->where('modalidad_id', $m->id)
            ->where('observaciones', $crashObservation)
            ->where('created_at', '>=', $crashStart)
            ->delete();

        $restoredCount++;
    }
    
    DB::commit();
    echo "Restauración exitosa.\n";
    echo "Registros procesados: " . $restoredCount . "\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR en la restauración: " . $e->getMessage() . "\n";
}
