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
                  ->orWhere('cue', 'like', '%' . $search . '%');
            });
        }

        if ($cui = $request->input('cui')) {
            $query->whereHas('establecimiento.edificio', function ($q) use ($cui) {
                $q->where('cui', 'like', '%' . $cui . '%');
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

        if ($ambito = $request->input('ambito')) {
            $query->where('ambito', $ambito);
        }

        return $query;
    }

    /**
     * Get audit statistics based on active filters (excluding the validation status itself).
     */
    public function getStats(Request $request): array
    {
        $kpiQuery = Modalidad::withTrashed();

        if ($search = $request->input('search')) {
            $kpiQuery->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%');
            });
        }

        if ($cui = $request->input('cui')) {
            $kpiQuery->whereHas('establecimiento.edificio', function ($q) use ($cui) {
                $q->where('cui', 'like', '%' . $cui . '%');
            });
        }

        if ($depto = $request->input('departamento')) {
            $kpiQuery->whereHas('establecimiento.edificio', function ($q) use ($depto) {
                $q->where('zona_departamento', $depto);
            });
        }

        if ($nivel = $request->input('nivel')) {
            $kpiQuery->where('nivel_educativo', $nivel);
        }

        if ($ambito = $request->input('ambito')) {
            $kpiQuery->where('ambito', $ambito);
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
     * Get dynamic filter options based on current selection.
     */
    public function getFilterOptions(Request $request): array
    {
        $estado = $request->input('estado');
        $depto = $request->input('departamento');
        $nivel = $request->input('nivel');
        $ambito = $request->input('ambito');

        // Niveles available for the current filters
        $nivelQuery = Modalidad::distinct()->whereNotNull('nivel_educativo');
        if ($estado) $nivelQuery->where('estado_validacion', $estado);
        if ($ambito) $nivelQuery->where('ambito', $ambito);
        if ($depto) {
            $nivelQuery->whereHas('establecimiento.edificio', function ($q) use ($depto) {
                $q->where('zona_departamento', $depto);
            });
        }
        $nivelesDisponibles = $nivelQuery->orderBy('nivel_educativo')->pluck('nivel_educativo');

        // Departamentos available for the current filters
        $deptoQuery = Edificio::distinct()->whereNotNull('zona_departamento');
        if ($estado || $nivel || $ambito) {
            $deptoQuery->whereHas('establecimientos.modalidades', function ($q) use ($estado, $nivel, $ambito) {
                if ($estado) $q->where('estado_validacion', $estado);
                if ($nivel) $q->where('nivel_educativo', $nivel);
                if ($ambito) $q->where('ambito', $ambito);
            });
        }
        $deptosDisponibles = $deptoQuery->orderBy('zona_departamento')->pluck('zona_departamento');

        return [
            'departamentos' => $deptosDisponibles,
            'niveles' => $nivelesDisponibles,
            'ambitos' => ['PUBLICO', 'PRIVADO'],
        ];
    }

    /**
     * Get building names map.
     */
    public function getBuildingNamesMap(): \Illuminate\Support\Collection
    {
        return Establecimiento::pluck('nombre', 'cue');
    }
}
