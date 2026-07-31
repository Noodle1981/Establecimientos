<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Services\AuditoriaQueryService;
use App\Services\ExcelExportService;
use App\Http\Requests\Administrativos\UpdateAuditoriaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;

class AuditoriaController extends Controller
{
    protected AuditoriaQueryService $queryService;

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
            'stats' => $this->queryService->getStats($request),
            'options' => $this->queryService->getFilterOptions($request)
        ]);
    }

    /**
     * Update validation status for a modality.
     */
    public function updateEstado(UpdateAuditoriaRequest $request, int $id)
    {
        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
                $modalidad = Modalidad::withTrashed()
                    ->with(['establecimiento' => function($q) { $q->withTrashed(); }])
                    ->findOrFail($id);

                // Actualizar la modalidad principal
                $modalidad->cambiarEstado(
                    $request->estado, 
                    $request->observaciones, 
                    Auth::id(),
                    $request->campos_auditados
                );

                // Propagar al edificio si se solicita de forma consciente
                if ($request->propagar_al_edificio && $modalidad->establecimiento) {
                    $camposCompartidos = ['Dirección', 'Edificio', 'CUI', 'GPS', 'RADIO'];
                    
                    // Extraer solo los campos compartidos que se marcaron en esta validación
                    $auditoriaCompartida = array_intersect($request->campos_auditados ?? [], $camposCompartidos);

                    $vinculados = Modalidad::withTrashed()
                        ->whereHas('establecimiento', function ($q) use ($modalidad) {
                            $q->where('edificio_id', $modalidad->establecimiento->edificio_id);
                        })
                        ->where('id', '!=', $id)
                        ->get();

                    foreach ($vinculados as $v) {
                        /** @var Modalidad $v */
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
            });

            return back()->with('success', 'Estado de auditoría actualizado correctamente.');
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Error al actualizar el estado de auditoría. Intente nuevamente.');
        }
    }

    /**
     * Get other establishments in the same building.
     */
    public function vinculados(int $id)
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
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        // Obtener los datos filtrados (sin paginación para el PDF)
        $modalidades = $this->queryService->getFilteredQuery($request)
            ->orderBy('validado_en', 'desc')
            ->get();
 
        $nombresEdificios = $this->queryService->getBuildingNamesMap();
        $stats = $this->queryService->getStats($request);
 
        $pdf = Pdf::loadView('pdf.auditoria_reporte', [
            'modalidades' => $modalidades,
            'nombresEdificios' => $nombresEdificios,
            'stats' => $stats,
            'filtros' => $request->all()
        ])->setPaper('a4', 'landscape');
 
        return $pdf->download('reporte_auditoria_' . date('Y-m-d') . '.pdf');
    }

    /**
     * Export audit report to Excel.
     */
    public function exportExcel(Request $request)
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $modalidades = $this->queryService->getFilteredQuery($request)
            ->orderBy('validado_en', 'desc')
            ->get();

        $nombresEdificios = $this->queryService->getBuildingNamesMap();
        $excelService = app(ExcelExportService::class);

        $headers = [
            'CUE',
            'Establecimiento',
            'Dirección',
            'Nivel Educativo / Modalidad',
            'Radio',
            'Sector',
            'Categoría',
            'Edificio / Cabecera',
            'CUI',
            'Latitud',
            'Longitud',
            'Estado Validación',
            'Campos Auditados',
            'Observaciones',
            'Fecha Última Validación',
            'Validado Por',
        ];

        [$spreadsheet, $sheet] = $excelService->setupSheet('Auditoría', $headers);

        $row = 2;
        foreach ($modalidades as $m) {
            $edificioNombre = isset($m->establecimiento?->edificio_id)
                ? ($nombresEdificios[$m->establecimiento->edificio_id] ?? 'S/D')
                : 'S/D';

            $direccion = trim(($m->establecimiento?->edificio?->calle ?? '') . ' ' . ($m->establecimiento?->edificio?->numero_puerta ?? ''));

            $camposAuditadosStr = is_array($m->campos_auditados)
                ? implode(', ', $m->campos_auditados)
                : ($m->campos_auditados ?? '-');

            $sheet->setCellValue("A{$row}", $m->establecimiento?->cue ?? '-');
            $sheet->setCellValue("B{$row}", $m->establecimiento?->nombre ?? 'Sin Establecimiento');
            $sheet->setCellValue("C{$row}", $direccion ?: '-');
            $sheet->setCellValue("D{$row}", $m->nivel_educativo ?? '-');
            $sheet->setCellValue("E{$row}", $m->radio ?? '-');
            $sheet->setCellValue("F{$row}", $m->sector ?? '-');
            $sheet->setCellValue("G{$row}", $m->categoria ?? '-');
            $sheet->setCellValue("H{$row}", $edificioNombre);
            $sheet->setCellValue("I{$row}", $m->establecimiento?->edificio?->cui ?? '-');
            $sheet->setCellValue("J{$row}", $m->establecimiento?->edificio?->latitud ?? '-');
            $sheet->setCellValue("K{$row}", $m->establecimiento?->edificio?->longitud ?? '-');
            $sheet->setCellValue("L{$row}", $m->estado_validacion ?? 'PENDIENTE');
            $sheet->setCellValue("M{$row}", $camposAuditadosStr ?: '-');
            $sheet->setCellValue("N{$row}", $m->observaciones ?? '-');
            $sheet->setCellValue("O{$row}", $m->validado_en ? \Carbon\Carbon::parse($m->validado_en)->format('d/m/Y H:i') : '-');
            $sheet->setCellValue("P{$row}", $m->usuarioValidacion?->name ?? ($m->validado_en ? 'Sistema' : '-'));

            $row++;
        }

        $excelService->autoSizeColumns($sheet, count($headers));

        $fileName = 'reporte_auditoria_' . date('Y-m-d') . '.xlsx';
        return $excelService->download($spreadsheet, $fileName);
    }
}
