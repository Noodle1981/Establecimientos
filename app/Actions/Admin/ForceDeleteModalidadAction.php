<?php

namespace App\Actions\Admin;

use App\Models\Modalidad;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class ForceDeleteModalidadAction
{
    public function __construct(
        protected ActivityLogService $logger
    ) {}

    public function execute(int|string $id): void
    {
        DB::transaction(function () use ($id) {
            $mod = Modalidad::withTrashed()->with([
                'establecimiento' => fn($q) => $q->withTrashed(),
                'establecimiento.modalidades' => fn($q) => $q->withTrashed()
            ])->findOrFail($id);

            $est = $mod->establecimiento;
            $name = $est?->nombre ?? 'Sin nombre';
            $cue = $est?->cue ?? 'S/CUE';

            // Borrado permanente de todas las modalidades asociadas a este establecimiento
            if ($est) {
                foreach ($est->modalidades()->withTrashed()->get() as $m) {
                    $m->forceDelete();
                }

                $est->forceDelete();
            } else {
                $mod->forceDelete();
            }

            $this->logger->logDelete($mod, "BORRADO PERMANENTE: {$name} (CUE: {$cue}). CUE liberado.");
        });
    }
}
