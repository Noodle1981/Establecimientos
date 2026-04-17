<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class EdificioController extends Controller
{
    /**
     * Display a listing of buildings.
     */
    public function index(Request $request): Response
    {
        $query = Edificio::with(['establecimientos.modalidades']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('cui', 'like', '%' . $search . '%')
                  ->orWhere('localidad', 'like', '%' . $search . '%')
                  ->orWhere('zona_departamento', 'like', '%' . $search . '%')
                  ->orWhereHas('establecimientos', function ($qEst) use ($search) {
                      $qEst->where('establecimiento_cabecera', 'like', '%' . $search . '%')
                           ->orWhere('nombre', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($zona = $request->input('zona')) {
            $query->where('zona_departamento', $zona);
        }

        if ($localidad = $request->input('localidad')) {
            $query->where('localidad', $localidad);
        }

        if ($ambito = $request->input('ambito')) {
            $query->whereHas('modalidades', function ($q) use ($ambito) {
                $q->where('ambito', $ambito);
            });
        }

        $edificios = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Administrativos/Edificios/Index', [
            'edificios' => $edificios,
            'filters' => $request->only(['search', 'zona', 'localidad', 'ambito']),
            'options' => [
                'zonas' => Edificio::select('zona_departamento')->distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento'),
                'localidades' => Edificio::select('localidad')->distinct()->whereNotNull('localidad')->orderBy('localidad')->pluck('localidad'),
                'ambitos' => ['PUBLICO', 'PRIVADO'],
            ]
        ]);
    }

    /**
     * Store a newly created building in storage.
     */
    public function store(Request $request, ActivityLogService $activityLogger)
    {
        $validated = $request->validate([
            'cui'              => 'required|string|max:50|unique:edificios,cui',
            'calle'            => 'required|string|max:255',
            'numero_puerta'    => 'nullable|string|max:20',
            'localidad'        => 'required|string|max:255',
            'zona_departamento'=> 'required|string|max:255',
            'codigo_postal'    => 'nullable|numeric',
            'latitud'          => 'nullable|numeric',
            'longitud'         => 'nullable|numeric',
            'letra_zona'       => 'nullable|string|max:1',
        ]);

        // Transform to uppercase
        foreach (['cui', 'localidad', 'calle', 'zona_departamento'] as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = strtoupper(trim($validated[$field]));
            }
        }

        $edificio = Edificio::create($validated);

        $activityLogger->logUpdate($edificio, "Creación de Edificio", [
            'after' => $validated,
        ]);

        return back()->with('success', 'Edificio creado correctamente.');
    }

    /**
     * Update the specified building in storage.
     */
    public function update(Request $request, $id, ActivityLogService $activityLogger)
    {
        $edificio = Edificio::findOrFail($id);

        $validated = $request->validate([
            'cui'              => 'required|string|max:50|unique:edificios,cui,' . $edificio->id,
            'calle'            => 'required|string|max:255',
            'numero_puerta'    => 'nullable|string|max:20',
            'codigo_postal'    => 'nullable|numeric',
            'localidad'        => 'required|string|max:255',
            'latitud'          => 'nullable|numeric',
            'longitud'         => 'nullable|numeric',
            'letra_zona'       => 'nullable|string|max:1',
            'zona_departamento'=> 'required|string|max:255',
        ]);

        // Transform to uppercase
        foreach (['cui', 'localidad', 'calle', 'zona_departamento'] as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = strtoupper(trim($validated[$field]));
            }
        }

        $edificio->fill($validated);

        if ($edificio->isDirty()) {
            $activityLogger->logUpdate($edificio, "Actualización de Edificio", [
                'before' => array_intersect_key($edificio->getOriginal(), $edificio->getDirty()),
                'after' => $edificio->getDirty(),
            ]);
            $edificio->save();
        }

        return back()->with('success', 'Edificio actualizado correctamente.');
    }

    /**
     * Export buildings to Excel.
     */
    public function export(Request $request)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        $headers = [
            'A1' => 'CUI', 'B1' => 'CALLE', 'C1' => 'N° PUERTA', 'D1' => 'LOCALIDAD', 'E1' => 'ZONA/DEPARTAMENTO', 'F1' => 'AMBITO'
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FE8204']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);

        $edificios = Edificio::with(['establecimientos.modalidades'])->get();
        
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

        $writer = new Xlsx($spreadsheet);
        $fileName = 'edificios_' . date('Y-m-d') . '.xlsx';
        
        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $fileName);
    }
}
