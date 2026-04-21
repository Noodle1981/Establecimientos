<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Models\Edificio;
use App\Models\Establecimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuditoriaController extends Controller
{
    /**
     * Display the audit dashboard.
     */
    public function index(Request $request): Response
    {
        $query = Modalidad::withTrashed()->with([
            'establecimiento.edificio' => function($q) {
                $q->withTrashed();
            },
            'establecimiento.cabecera.edificio' => function($q) {
                $q->withTrashed();
            },
            'usuarioValidacion'
        ]);

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%')
                  ->orWhereHas('edificio', function ($q2) use ($search) {
                      $q2->where('cui', 'like', '%' . $search . '%');
                  });
            });
        }

        // Filtros
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

        // Conteo para KPIs (sin filtro de estado para ver el total)
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

        $modalidades = $query->orderBy('validado_en', 'desc')->paginate(15)->withQueryString();

        // Mapa de nombres de cabeceras (CUI -> Nombre)
        // Buscamos establecimientos que terminan en '00' o que son marcados como cabecera para dar nombre al edificio
        $nombresEdificios = Establecimiento::where('cue', 'LIKE', '%00')
            ->pluck('nombre', 'cue')
            ->mapWithKeys(function ($nombre, $cue) {
                return [substr((string)$cue, 0, 7) => $nombre];
            });

        return Inertia::render('Administrativos/Auditoria/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->all(),
            'nombresEdificios' => $nombresEdificios,
            'stats' => [
                'pendientes' => $stats['PENDIENTE'] ?? 0,
                'correctos' => $stats['CORRECTO'] ?? 0,
                'corregidos' => $stats['CORREGIDO'] ?? 0,
                'revisar' => $stats['REVISAR'] ?? 0,
                'bajas' => $stats['BAJA'] ?? 0,
                'total' => $totalCount,
                'porcentajeAvance' => $porcentajeAvance,
            ],
            'options' => [
                'departamentos' => Edificio::distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento'),
                'niveles' => Modalidad::distinct()->whereNotNull('nivel_educativo')->orderBy('nivel_educativo')->pluck('nivel_educativo'),
            ]
        ]);
    }

    /**
     * Update validation status for a modality.
     */
    public function updateEstado(Request $request, $id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'estado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,REVISAR,BAJA',
            'observaciones' => 'nullable|string',
        ]);

        $modalidad->cambiarEstado(
            $validated['estado'], 
            $validated['observaciones'], 
            Auth::id()
        );

        return back()->with('success', 'Estado de auditoría actualizado correctamente.');
    }
}
