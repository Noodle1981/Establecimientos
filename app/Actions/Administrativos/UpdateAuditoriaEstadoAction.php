<?php

namespace App\Actions\Administrativos;

use App\Models\Modalidad;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UpdateAuditoriaEstadoAction
{
    /**
     * Update validation status for a modality and optionally propagate building-level fields.
     */
    public function execute(Modalidad $modalidad, array $data): void
    {
        DB::transaction(function () use ($modalidad, $data) {
            $estado = $data['estado'];
            $observaciones = $data['observaciones'] ?? null;
            $camposAuditados = $data['campos_auditados'] ?? [];
            $propagarAlEdificio = ! empty($data['propagar_al_edificio']);
            $userId = Auth::id();

            // 1. Actualizar la modalidad principal
            $modalidad->cambiarEstado(
                $estado,
                $observaciones,
                $userId,
                $camposAuditados
            );

            // 2. Propagar al edificio si se solicita de forma consciente
            if ($propagarAlEdificio && $modalidad->establecimiento) {
                $camposCompartidos = ['Dirección', 'Edificio', 'CUI', 'GPS', 'RADIO'];

                // Extraer solo los campos compartidos que se marcaron en esta validación
                $auditoriaCompartida = array_intersect($camposAuditados, $camposCompartidos);

                $vinculados = Modalidad::withTrashed()
                    ->whereHas('establecimiento', function ($q) use ($modalidad) {
                        $q->where('edificio_id', $modalidad->establecimiento->edificio_id);
                    })
                    ->where('id', '!=', $modalidad->id)
                    ->get();

                foreach ($vinculados as $v) {
                    /** @var Modalidad $v */
                    $camposActuales = $v->campos_auditados ?? [];

                    // Quitamos los compartidos viejos y ponemos los nuevos
                    $camposLimpios = array_diff($camposActuales, $camposCompartidos);
                    $nuevosCampos = array_unique(array_merge($camposLimpios, $auditoriaCompartida));

                    $v->cambiarEstado(
                        $estado,
                        $v->observaciones,
                        $userId,
                        $nuevosCampos
                    );
                }
            }
        });
    }
}
