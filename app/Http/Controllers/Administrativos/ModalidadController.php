<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;
use App\Models\Establecimiento;
use App\Models\Edificio;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ModalidadController extends Controller
{
    /**
     * Display a listing of modalities (Establecimientos in UI).
     */
    public function index(Request $request): Response
    {
        $query = Modalidad::with(['establecimiento.edificio']);

        if ($search = $request->input('search')) {
            $query->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%')
                  ->orWhereHas('edificio', function ($qEdificio) use ($search) {
                      $qEdificio->where('cui', 'like', '%' . $search . '%');
                  });
            });
        }

        // Apply filters
        foreach (['nivel_educativo', 'ambito', 'direccion_area', 'zona', 'radio', 'sector'] as $filter) {
            if ($value = $request->input($filter)) {
                $query->where($filter, $value);
            }
        }

        if ($request->input('estado') === 'VALIDADO') {
            $query->where('validado', true);
        } elseif ($request->input('estado') === 'PENDIENTE') {
            $query->where('validado', false);
        }

        $modalidades = $query->latest()->paginate(15)->withQueryString();

        $options = Cache::remember('modalidades_options_react', 3600, function () {
            return [
                'niveles' => Modalidad::select('nivel_educativo')->distinct()->whereNotNull('nivel_educativo')->orderBy('nivel_educativo')->pluck('nivel_educativo'),
                'ambitos' => Modalidad::select('ambito')->distinct()->whereNotNull('ambito')->pluck('ambito'),
                'areas' => Modalidad::select('direccion_area')->distinct()->whereNotNull('direccion_area')->orderBy('direccion_area')->pluck('direccion_area'),
                'zonas' => Modalidad::select('zona')->distinct()->whereNotNull('zona')->orderBy('zona')->pluck('zona'),
                'radios' => Modalidad::select('radio')->distinct()->whereNotNull('radio')->orderBy('radio')->pluck('radio'),
                'sectores' => Modalidad::select('sector')->distinct()->whereNotNull('sector')->orderBy('sector')->pluck('sector'),
            ];
        });

        return Inertia::render('Administrativos/Establecimientos/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->all(),
            'options' => $options
        ]);
    }

    /**
     * Store a new modality (complex logic).
     */
    public function store(Request $request, ActivityLogService $activityLogger)
    {
        $validated = $request->validate([
            'nombre_establecimiento' => 'required|string',
            'cue' => ['required', 'regex:/^(\d{9}|PROV.*)$/'],
            'cui' => ['required', 'regex:/^(\d{7}|PROV.*)$/'],
            'establecimiento_cabecera' => 'required|string',
            'nivel_educativo' => 'required',
            'direccion_area' => 'required',
            'ambito' => 'required',
            'sector' => 'nullable',
            'radio' => 'nullable',
            'zona' => 'nullable',
            'calle' => 'required',
            'localidad' => 'required',
            'zona_departamento' => 'required',
        ]);

        // Normalize
        $validated['nombre_establecimiento'] = strtoupper($validated['nombre_establecimiento']);
        $validated['calle'] = strtoupper($validated['calle']);
        $validated['localidad'] = strtoupper($validated['localidad']);

        // 1. Edificio
        $edificio = Edificio::firstOrCreate(
            ['cui' => $validated['cui']],
            [
                'calle' => $validated['calle'],
                'localidad' => $validated['localidad'],
                'zona_departamento' => strtoupper($validated['zona_departamento']),
            ]
        );

        // 2. Establecimiento
        $establecimiento = Establecimiento::firstOrCreate(
            ['cue' => $validated['cue']],
            [
                'edificio_id' => $edificio->id,
                'nombre' => $validated['nombre_establecimiento'],
                'establecimiento_cabecera' => strtoupper($validated['establecimiento_cabecera']),
                'cue_edificio_principal' => $validated['cue'],
            ]
        );

        // 3. Modalidad
        $modalidad = Modalidad::create([
            'establecimiento_id' => $establecimiento->id,
            'direccion_area' => $validated['direccion_area'],
            'nivel_educativo' => $validated['nivel_educativo'],
            'sector' => $validated['sector'],
            'radio' => $validated['radio'],
            'zona' => strtoupper($validated['zona'] ?? ''),
            'ambito' => $validated['ambito'],
            'validado' => false,
        ]);

        $activityLogger->logUpdate($modalidad, "Creación de Establecimiento/Modalidad", ['after' => $validated]);

        return back()->with('success', 'Establecimiento creado correctamente.');
    }

    /**
     * Display a listing of legal instruments.
     */
    public function instrumentosIndex(Request $request): Response
    {
        $query = Modalidad::with(['establecimiento.edificio']);

        if ($search = $request->input('search')) {
            $query->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%')
                  ->orWhereHas('edificio', function ($qEdificio) use ($search) {
                      $qEdificio->where('cui', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($request->boolean('missing')) {
            $query->where(function($q) {
                $q->whereNull('inst_legal_radio')->orWhere('inst_legal_radio', '')
                  ->orWhereNull('inst_legal_categoria')->orWhere('inst_legal_categoria', '')
                  ->orWhereNull('inst_legal_creacion')->orWhere('inst_legal_creacion', '');
            });
        }

        $modalidades = $query->paginate(20)->withQueryString();

        return Inertia::render('Administrativos/Instrumentos/Index', [
            'modalidades' => $modalidades,
            'filters' => $request->only(['search', 'missing']),
        ]);
    }

    /**
     * Update legal instruments for a modality.
     */
    public function instrumentosUpdate(Request $request, $id)
    {
        $modalidad = Modalidad::findOrFail($id);

        $validated = $request->validate([
            'inst_legal_radio' => 'nullable|string|max:255',
            'inst_legal_categoria' => 'nullable|string|max:255',
            'inst_legal_creacion' => 'nullable|string|max:255',
        ]);

        $modalidad->update($validated);

        return back()->with('success', 'Instrumentos legales actualizados.');
    }

    /**
     * Update modality and sync buildings/establishments.
     */
    public function update(Request $request, $id, ActivityLogService $activityLogger)
    {
        $modalidad = Modalidad::with('establecimiento.edificio')->findOrFail($id);

        $validated = $request->validate([
            'cui' => ['required', 'regex:/^(\d{7}|PROV.*)$/'],
            'cue' => ['required', 'regex:/^(\d{9}|PROV.*)$/'],
            'nombre_establecimiento' => 'required|string',
            'nivel_educativo' => 'required',
            'direccion_area' => 'required',
            'validado' => 'boolean',
            'radio' => 'nullable',
            'sector' => 'nullable',
            'ambito' => 'required',
        ]);

        // Sync Edificio
        $edificio = $modalidad->establecimiento->edificio;
        if ($edificio->cui !== $validated['cui']) {
            $targetEdificio = Edificio::where('cui', $validated['cui'])->first();
            if ($targetEdificio) {
                $modalidad->establecimiento->update(['edificio_id' => $targetEdificio->id]);
            } else {
                $edificio->update(['cui' => strtoupper($validated['cui'])]);
            }
        }

        // Sync Establecimiento
        $modalidad->establecimiento->update([
            'cue' => $validated['cue'],
            'nombre' => strtoupper($validated['nombre_establecimiento']),
        ]);

        // Sync Modalidad
        $modalidad->update([
            'nivel_educativo' => $validated['nivel_educativo'],
            'direccion_area' => $validated['direccion_area'],
            'validado' => $validated['validado'],
            'radio' => $validated['radio'],
            'sector' => $validated['sector'],
            'ambito' => $validated['ambito'],
        ]);

        return back()->with('success', 'Datos actualizados correctamente.');
    }

    /**
     * Export to Excel.
     */
    public function export(Request $request)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        $headers = [
            'A1' => 'CUE', 'B1' => 'CUI', 'C1' => 'NOMBRE', 'D1' => 'NIVEL', 'E1' => 'AREA', 'F1' => 'ESTADO'
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FE8204']],
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);

        $data = Modalidad::with('establecimiento.edificio')->get();
        
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

        $writer = new Xlsx($spreadsheet);
        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, 'establecimientos.xlsx');
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
