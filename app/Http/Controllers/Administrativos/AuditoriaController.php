<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Services\AuditoriaQueryService;
use App\Http\Requests\Administrativos\UpdateAuditoriaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Administrativos/Auditoria/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->all(),
            'nombresEdificios' => $this->queryService->getBuildingNamesMap(),
            'stats' => $this->queryService->getStats($request->input('departamento')),
            'options' => $this->queryService->getFilterOptions()
        ]);
    }

    /**
     * Update validation status for a modality.
     */
    public function updateEstado(UpdateAuditoriaRequest $request, $id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);

        $modalidad->cambiarEstado(
            $request->estado, 
            $request->observaciones, 
            Auth::id()
        );

        return back()->with('success', 'Estado de auditoría actualizado correctamente.');
    }
}
