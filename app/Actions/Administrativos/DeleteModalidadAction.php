<?php

namespace App\Actions\Administrativos;

use App\Models\Modalidad;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class DeleteModalidadAction
{
    public function __construct(private ActivityLogService $activityLogger) {}

    /**
     * Delete a modality and trigger atomic cascade if it is the last one in the establishment.
     */
    public function execute(Modalidad $modalidad): void
    {
        DB::transaction(function () use ($modalidad) {
            $establecimiento = $modalidad->establecimiento;

            // 1. Cambiar estado a ELIMINADO para la bitácora
            $modalidad->cambiarEstado('ELIMINADO', 'Baja por administrativo', auth()->id());

            // 2. Soft-delete de la modalidad
            $modalidad->delete();

            // 3. Cascada automática si es la última modalidad activa del establecimiento
            if ($establecimiento && $establecimiento->modalidades()->count() === 0) {
                $establecimiento->delete();
                $this->activityLogger->logDelete(
                    $establecimiento,
                    'Baja atómica de establecimiento por quedarse sin modalidades: CUE '.$establecimiento->cue
                );
            } else {
                $this->activityLogger->logDelete(
                    $modalidad,
                    'Baja de modalidad individual: CUE '.($establecimiento->cue ?? 'S/D')
                );
            }
        });
    }
}
