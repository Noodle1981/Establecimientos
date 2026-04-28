<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Edificio;
use App\Services\EdificioQueryService;
use App\Services\ExcelExportService;
use App\Actions\Administrativos\StoreEdificioAction;
use App\Actions\Administrativos\UpdateEdificioAction;
use App\Http\Requests\Administrativos\StoreEdificioRequest;
use App\Http\Requests\Administrativos\UpdateEdificioRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EdificioController extends Controller
{
    protected $queryService;
    protected $exportService;

    public function __construct(EdificioQueryService $queryService, ExcelExportService $exportService)
    {
        $this->queryService = $queryService;
        $this->exportService = $exportService;
    }

    /**
     * Display a listing of buildings.
     */
    public function index(Request $request): Response
    {
        $edificios = $this->queryService->getFilteredQuery($request)
            ->paginate(10)
            ->onEachSide(1)
            ->withQueryString();

        return Inertia::render('Administrativos/Edificios/Index', [
            'edificios' => $edificios,
            'filters' => $request->only(['search', 'zona_departamento', 'localidad', 'ambito']),
            'options' => $this->queryService->getFilterOptions()
        ]);
    }

    /**
     * Store a newly created building in storage.
     */
    public function store(StoreEdificioRequest $request, StoreEdificioAction $action)
    {
        $action->execute($request->validated());

        return back()->with('success', 'Edificio creado correctamente.');
    }

    /**
     * Update the specified building in storage.
     */
    public function update(UpdateEdificioRequest $request, $id, UpdateEdificioAction $action)
    {
        $edificio = Edificio::findOrFail($id);
        
        $action->execute($edificio, $request->validated());

        return back()->with('success', 'Edificio actualizado correctamente.');
    }

    /**
     * Export buildings to Excel.
     */
    public function export(Request $request)
    {
        $edificios = $this->queryService->getFilteredQuery($request)->get();
        
        $headers = ['CUI', 'CALLE', 'N° PUERTA', 'LOCALIDAD', 'ZONA/DEPARTAMENTO', 'AMBITO'];
        [$spreadsheet, $sheet] = $this->exportService->setupSheet('Edificios', $headers);

        $row = 2;
        foreach ($edificios as $edificio) {
            $ambito = $edificio->establecimientos->flatMap->modalidades->first()?->ambito ?? 'S/D';
            
            $sheet->setCellValue('A' . $row, $edificio->cui);
            $sheet->setCellValue('B' . $row, $edificio->calle);
            $sheet->setCellValue('C' . $row, $edificio->numero_puerta);
            $sheet->setCellValue('D' . $row, $edificio->localidad);
            $sheet->setCellValue('E' . $row, $edificio->zona_departamento);
            $sheet->setCellValue('F' . $row, $ambito);
            $row++;
        }

        $this->exportService->autoSizeColumns($sheet, count($headers));
        
        return $this->exportService->download($spreadsheet, 'edificios_' . date('Y-m-d') . '.xlsx');
    }
}
