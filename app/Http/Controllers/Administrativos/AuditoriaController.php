<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Services\AuditoriaQueryService;
use App\Http\Requests\Administrativos\UpdateAuditoriaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;

class AuditoriaController extends Controller
{
    protected $queryService;

    public function __construct(AuditoriaQueryService $queryService)
    {
        $this->queryService = $queryService;
    }

    /**
     * Display the audit dashboard.
     */
    public function index(Request $request): Response
    {
        $modalidades = $this->queryService->getFilteredQuery($request)
            ->orderBy('validado_en', 'desc')
            ->paginate(10)
            ->onEachSide(1)
            ->withQueryString();

        return Inertia::render('Administrativos/Auditoria/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->all(),
            'nombresEdificios' => $this->queryService->getBuildingNamesMap(),
            'stats' => $this->queryService->getStats($request->input('departamento')),
            'options' => $this->queryService->getFilterOptions($request)
        ]);
    }

    /**
     * Update validation status for a modality.
     */
    public function updateEstado(UpdateAuditoriaRequest $request, $id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);

        // Actualizar la modalidad principal
        $modalidad->cambiarEstado(
            $request->estado, 
            $request->observaciones, 
            Auth::id(),
            $request->campos_auditados
        );

        // Propagar al edificio si se solicita de forma consciente
        if ($request->propagar_al_edificio) {
            $camposCompartidos = ['Dirección', 'Edificio', 'CUI', 'GPS'];
            
            // Extraer solo los campos compartidos que se marcaron en esta validación
            $auditoriaCompartida = array_intersect($request->campos_auditados ?? [], $camposCompartidos);

            $vinculados = Modalidad::withTrashed()
                ->whereHas('establecimiento', function ($q) use ($modalidad) {
                    $q->where('edificio_id', $modalidad->establecimiento->edificio_id);
                })
                ->where('id', '!=', $id)
                ->get();

            foreach ($vinculados as $v) {
                /** @var \App\Models\Modalidad $v */
                // Para los vinculados, mantenemos sus campos específicos actuales 
                // y solo actualizamos/sincronizamos los campos de edificio (compartidos)
                $camposActuales = $v->campos_auditados ?? [];
                
                // Quitamos los compartidos viejos y ponemos los nuevos
                $camposLimpios = array_diff($camposActuales, $camposCompartidos);
                $nuevosCampos = array_unique(array_merge($camposLimpios, $auditoriaCompartida));

                $v->cambiarEstado(
                    $request->estado,
                    $v->observaciones, // Mantener la observación individual de cada escuela
                    Auth::id(),
                    $nuevosCampos
                );
            }
        }

        return back()->with('success', 'Estado de auditoría actualizado correctamente.');
    }

    /**
     * Get other establishments in the same building.
     */
    public function vinculados($id)
    {
        $modalidad = Modalidad::withTrashed()->with('establecimiento')->findOrFail($id);
        
        $vinculados = Modalidad::withTrashed()
            ->whereHas('establecimiento', function ($q) use ($modalidad) {
                $q->where('edificio_id', $modalidad->establecimiento->edificio_id);
            })
            ->where('id', '!=', $id)
            ->with(['establecimiento', 'usuarioValidacion'])
            ->get();
            
        return response()->json($vinculados);
    }

    /**
     * Export audit report to PDF.
     */
    public function exportPdf(Request $request)
    {
        // Obtener los datos filtrados (sin paginación para el PDF)
        $modalidades = $this->queryService->getFilteredQuery($request)
            ->orderBy('validado_en', 'desc')
            ->get();

        $nombresEdificios = $this->queryService->getBuildingNamesMap();

        $pdf = Pdf::loadView('pdf.auditoria_reporte', [
            'modalidades' => $modalidades,
            'nombresEdificios' => $nombresEdificios,
            'filtros' => $request->all()
        ])->setPaper('a4', 'landscape');

        return $pdf->download('reporte_auditoria_' . date('Y-m-d') . '.pdf');
    }
}
