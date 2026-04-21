<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Models\Edificio;
use App\Services\ActivityLogService;
use App\Services\ModalidadQueryService;
use App\Services\ExcelExportService;
use App\Actions\Administrativos\StoreModalidadAction;
use App\Actions\Administrativos\UpdateModalidadAction;
use App\Http\Requests\Administrativos\StoreModalidadRequest;
use App\Http\Requests\Administrativos\UpdateModalidadRequest;
use App\Http\Requests\Administrativos\UpdateInstrumentosRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ModalidadController extends Controller
{
    protected $queryService;
    protected $exportService;

    public function __construct(ModalidadQueryService $queryService, ExcelExportService $exportService)
    {
        $this->queryService = $queryService;
        $this->exportService = $exportService;
    }

    /**
     * Display a listing of modalities (Establecimientos in UI).
     */
    public function index(Request $request): Response
    {
        $modalidades = $this->queryService->getFilteredQuery($request)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $options = Cache::remember('modalidades_options_react', 3600, function () {
            return $this->queryService->getFilterOptions();
        });

        return Inertia::render('Administrativos/Establecimientos/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->all(),
            'options' => $options
        ]);
    }

    /**
     * Store a new modality.
     */
    public function store(StoreModalidadRequest $request, StoreModalidadAction $action, ActivityLogService $activityLogger)
    {
        $modalidad = $action->execute($request->validated());

        $activityLogger->logUpdate($modalidad, "Creación de Establecimiento/Modalidad", ['after' => $request->validated()]);

        return back()->with('success', 'Establecimiento creado correctamente.');
    }

    /**
     * Display a listing of legal instruments.
     */
    public function instrumentosIndex(Request $request): Response
    {
        $modalidades = $this->queryService->getFilteredQuery($request)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Administrativos/Instrumentos/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->only(['search', 'missing']),
        ]);
    }

    /**
     * Update legal instruments for a modality.
     */
    public function instrumentosUpdate(UpdateInstrumentosRequest $request, $id)
    {
        $modalidad = Modalidad::findOrFail($id);
        $modalidad->update($request->validated());

        return back()->with('success', 'Instrumentos legales actualizados.');
    }

    /**
     * Update modality and sync buildings/establishments.
     */
    public function update(UpdateModalidadRequest $request, $id, UpdateModalidadAction $action)
    {
        $modalidad = Modalidad::with('establecimiento.edificio')->findOrFail($id);
        
        $action->execute($modalidad, $request->validated());

        return back()->with('success', 'Datos actualizados correctamente.');
    }

    /**
     * Export to Excel.
     */
    public function export(Request $request)
    {
        $data = $this->queryService->getFilteredQuery($request)->get();
        
        $headers = ['CUE', 'CUI', 'NOMBRE', 'NIVEL', 'AREA', 'ESTADO'];
        [$spreadsheet, $sheet] = $this->exportService->setupSheet('Establecimientos', $headers);

        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item->establecimiento->cue);
            $sheet->setCellValue('B' . $row, $item->establecimiento->edificio->cui);
            $sheet->setCellValue('C' . $row, $item->establecimiento->nombre);
            $sheet->setCellValue('D' . $row, $item->nivel_educativo);
            $sheet->setCellValue('E' . $row, $item->direccion_area);
            $sheet->setCellValue('F' . $row, $item->validado ? 'VALIDADO' : 'PENDIENTE');
            $row++;
        }

        $this->exportService->autoSizeColumns($sheet, count($headers));

        return $this->exportService->download($spreadsheet, 'establecimientos.xlsx');
    }

    /**
     * API for CUI lookup.
     */
    public function lookupEdificio($cui)
    {
        $edificio = Edificio::where('cui', $cui)->first();
        if (!$edificio) return response()->json(null);

        return response()->json([
            'calle' => $edificio->calle,
            'localidad' => $edificio->localidad,
            'zona_departamento' => $edificio->zona_departamento,
            'numero_puerta' => $edificio->numero_puerta,
        ]);
    }
}
