<?php

namespace App\Services;

use App\Models\Modalidad;
use App\Models\Edificio;
use App\Models\Establecimiento;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AuditoriaQueryService
{
    /**
     * Build filtered query for audit.
     */
    public function getFilteredQuery(Request $request): Builder
    {
        $query = Modalidad::withTrashed()->with([
            'establecimiento.edificio' => function($q) { $q->withTrashed(); },
            'establecimiento.cabecera.edificio' => function($q) { $q->withTrashed(); },
            'usuarioValidacion'
        ]);

        if ($search = $request->input('search')) {
            $query->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%')
                  ->orWhereHas('edificio', function ($q2) use ($search) {
                      $q2->where('cui', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($estado = $request->input('estado')) {
            $query->where('estado_validacion', $estado);
        }

        if ($depto = $request->input('departamento')) {
            $query->whereHas('establecimiento.edificio', function ($q) use ($depto) {
                $q->where('zona_departamento', $depto);
            });
        }

        if ($nivel = $request->input('nivel')) {
            $query->where('nivel_educativo', $nivel);
        }

        return $query;
    }

    /**
     * Get audit statistics.
     */
    public function getStats(?string $depto = null): array
    {
        $kpiQuery = Modalidad::withTrashed();
        if ($depto) {
            $kpiQuery->whereHas('establecimiento.edificio', function ($q) use ($depto) {
                $q->where('zona_departamento', $depto);
            });
        }
        
        $stats = $kpiQuery->selectRaw('estado_validacion, count(*) as total')
            ->groupBy('estado_validacion')
            ->pluck('total', 'estado_validacion')
            ->toArray();

        $totalCount = array_sum($stats);
        $procesados = ($stats['CORRECTO'] ?? 0) + ($stats['CORREGIDO'] ?? 0);
        $porcentajeAvance = $totalCount > 0 ? round(($procesados / $totalCount) * 100, 1) : 0;

        return [
            'pendientes' => $stats['PENDIENTE'] ?? 0,
            'correctos' => $stats['CORRECTO'] ?? 0,
            'corregidos' => $stats['CORREGIDO'] ?? 0,
            'revisar' => $stats['REVISAR'] ?? 0,
            'bajas' => $stats['BAJA'] ?? 0,
            'total' => $totalCount,
            'porcentajeAvance' => $porcentajeAvance,
        ];
    }

    /**
     * Get filter options.
     */
    public function getFilterOptions(): array
    {
        return [
            'departamentos' => Edificio::distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento'),
            'niveles' => Modalidad::distinct()->whereNotNull('nivel_educativo')->orderBy('nivel_educativo')->pluck('nivel_educativo'),
        ];
    }

    /**
     * Get building names map.
     */
    public function getBuildingNamesMap(): \Illuminate\Support\Collection
    {
        return Establecimiento::where('cue', 'LIKE', '%00')
            ->pluck('nombre', 'cue')
            ->mapWithKeys(function ($nombre, $cue) {
                return [substr((string)$cue, 0, 7) => $nombre];
            });
    }
}
