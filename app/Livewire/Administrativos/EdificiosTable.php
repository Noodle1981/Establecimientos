<?php

namespace App\Livewire\Administrativos;

use App\Models\Edificio;
use App\Models\Establecimiento;
use Livewire\Component;
use Livewire\WithPagination;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class EdificiosTable extends Component
{
    use WithPagination;

    public $search = '';
    public $zonaFilter = '';
    public $localidadFilter = '';
    public $ambitoFilter = '';

    // Modales
    public $showViewModal = false;
    public $showEditModal = false;
    public $showCreateModal = false;
    public $selectedEdificio = null;

    // Formulario de edición
    public $editForm = [
        'cui' => '',
        'cue_edificio_principal' => '',
        'establecimiento_cabecera' => '',
        'codigo_postal' => '',
        'localidad' => '',
        'calle' => '',
        'numero_puerta' => '',
        'latitud' => '',
        'longitud' => '',
        'letra_zona' => '',
        'zona_departamento' => '',
    ];
    
    public $nombreEstablecimientoPrincipal = '';

    // Formulario de creación
    public $createForm = [
        'cui' => '',
        'calle' => '',
        'numero_puerta' => '',
        'orientacion' => '',
        'codigo_postal' => '',
        'localidad' => '',
        'zona_departamento' => '',
        'letra_zona' => '',
        'latitud' => '',
        'longitud' => '',
        'te_voip' => '',
    ];

    protected $queryString = [
        'search',
        'zonaFilter',
        'localidadFilter',
        'ambitoFilter',
    ];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updated($propertyName)
    {
        if (in_array($propertyName, ['zonaFilter', 'localidadFilter', 'ambitoFilter'])) {
            $this->resetPage();
        }
        
        if ($propertyName === 'editForm.cue_edificio_principal') {
            $this->checkEstablecimientoPrincipal();
        }
    }

    public function checkEstablecimientoPrincipal()
    {
        $cue = $this->editForm['cue_edificio_principal'];
        if (!empty($cue)) {
            $establecimiento = Establecimiento::where('cue', $cue)->first();
            if ($establecimiento) {
                $this->nombreEstablecimientoPrincipal = $establecimiento->nombre;
                $this->editForm['establecimiento_cabecera'] = $establecimiento->nombre ?? '';
            } else {
                $this->nombreEstablecimientoPrincipal = 'No se encontró un establecimiento con este CUE';
            }
        } else {
            $this->nombreEstablecimientoPrincipal = '';
        }
    }

    public function getFilteredQuery()
    {
        $query = Edificio::with(['establecimientos']);

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('cui', 'like', '%' . $this->search . '%')
                  ->orWhere('localidad', 'like', '%' . $this->search . '%')
                  ->orWhere('zona_departamento', 'like', '%' . $this->search . '%')
                  ->orWhereHas('establecimientos', function ($qEst) {
                      $qEst->where('establecimiento_cabecera', 'like', '%' . $this->search . '%');
                  });
            });
        }

        if ($this->zonaFilter) {
            $query->where('zona_departamento', trim($this->zonaFilter));
        }

        if ($this->localidadFilter) {
            $query->where('localidad', 'like', '%' . trim($this->localidadFilter) . '%');
        }

        if ($this->ambitoFilter) {
            $query->whereHas('establecimientos.modalidades', function ($q) {
                $q->where('ambito', $this->ambitoFilter);
            });
        }

        return $query;
    }

    public function render()
    {
        return view('livewire.administrativos.edificios-table', [
            'edificios' => $this->getFilteredQuery()->paginate(20),
            'zonas' => Edificio::select('zona_departamento')->distinct()->orderBy('zona_departamento')->pluck('zona_departamento'),
            'localidades' => Edificio::select('localidad')->distinct()->whereNotNull('localidad')->orderBy('localidad')->pluck('localidad'),
        ])->layout('layouts.app');
    }

    public function exportExcel()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Headers
        $headers = [
            'A1' => 'CUI',
            'B1' => 'CUE EDIFICIO PRINCIPAL',
            'C1' => 'ESTABLECIMIENTO CABECERA',
            'D1' => 'CALLE',
            'E1' => 'N° PUERTA',
            'F1' => 'CÓDIGO POSTAL',
            'G1' => 'LOCALIDAD',
            'H1' => 'LATITUD',
            'I1' => 'LONGITUD',
            'J1' => 'LETRA ZONA',
            'K1' => 'ZONA/DEPARTAMENTO',
            'L1' => 'CANT. ESTABLECIMIENTOS',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style Headers
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'FE8204']
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ];
        $sheet->getStyle('A1:L1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(20);

        // Populate Data
        $rows = $this->getFilteredQuery()->get();
        
        $row = 2;
        foreach ($rows as $edificio) {
            // Obtener el establecimiento cabecera (primer establecimiento con cue_edificio_principal o el primero)
            $establecimientoCabecera = $edificio->establecimientos
                ->first(fn($e) => $e->cue_edificio_principal) 
                ?? $edificio->establecimientos->first();

            $sheet->setCellValue('A' . $row, $edificio->cui);
            $sheet->setCellValue('B' . $row, $establecimientoCabecera->cue_edificio_principal ?? $establecimientoCabecera->cue ?? '');
            $sheet->setCellValue('C' . $row, $establecimientoCabecera->establecimiento_cabecera ?? '');
            $sheet->setCellValue('D' . $row, $edificio->calle);
            $sheet->setCellValue('E' . $row, $edificio->numero_puerta);
            $sheet->setCellValue('F' . $row, $edificio->codigo_postal);
            $sheet->setCellValue('G' . $row, $edificio->localidad);
            $sheet->setCellValue('H' . $row, $edificio->latitud);
            $sheet->setCellValue('I' . $row, $edificio->longitud);
            $sheet->setCellValue('J' . $row, $edificio->letra_zona);
            $sheet->setCellValue('K' . $row, $edificio->zona_departamento);
            $sheet->setCellValue('L' . $row, $edificio->establecimientos->count());
            
            $row++;
        }

        // Auto Size Columns
        foreach (range('A', 'L') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Output
        $writer = new Xlsx($spreadsheet);
        $fileName = 'edificios_' . date('Y-m-d_His') . '.xlsx';
        
        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $fileName);
    }

    public function exportRadioAudit()
    {
        // Cargar datos del archivo de auditoría de radios
        $excelPath = base_path('estados_radios.xlsx');
        
        if (!file_exists($excelPath)) {
            session()->flash('error', 'No se encontró el archivo estados_radios.xlsx');
            return;
        }

        // Leer el archivo Excel de auditoría
        $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
        $auditSpreadsheet = $reader->load($excelPath);
        $auditSheet = $auditSpreadsheet->getActiveSheet();
        
        // Convertir datos de auditoría a array asociativo
        $auditData = [];
        $highestRow = $auditSheet->getHighestRow();
        
        for ($row = 2; $row <= $highestRow; $row++) {
            $cue = $auditSheet->getCell('A' . $row)->getValue();
            $cui = $auditSheet->getCell('B' . $row)->getValue();
            
            $auditData[] = [
                'cue' => $cue,
                'cui' => $cui,
                'punto_partida' => $auditSheet->getCell('C' . $row)->getValue(),
                'dist_circunf' => $auditSheet->getCell('D' . $row)->getValue(),
                'radio_circ' => $auditSheet->getCell('E' . $row)->getValue(),
                'distancia_camino' => $auditSheet->getCell('F' . $row)->getValue(),
                'radio_camino' => $auditSheet->getCell('G' . $row)->getValue(),
                'radio_sige' => $auditSheet->getCell('H' . $row)->getValue(),
                'estado' => trim($auditSheet->getCell('I' . $row)->getCalculatedValue()),
            ];
        }

        // Crear nuevo spreadsheet para exportación
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Headers
        $headers = [
            'A1' => 'CUI',
            'B1' => 'CUE',
            'C1' => 'ESTABLECIMIENTO',
            'D1' => 'CANT. ESTABLECIMIENTOS',
            'E1' => 'PUNTO PARTIDA',
            'F1' => 'DIST CIRCUNF (km)',
            'G1' => 'RADIO CIRC (km)',
            'H1' => 'DIST CAMINO (km)',
            'I1' => 'RADIO CAMINO (km)',
            'J1' => 'RADIO SIGE (km)',
            'K1' => 'ESTADO',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style Headers
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1D6F42']
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ];
        $sheet->getStyle('A1:K1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(20);

        // Obtener todos los establecimientos con sus edificios y contar modalidades por edificio
        $establecimientos = Establecimiento::with('edificio')->get();
        
        // Crear un mapa de establecimientos por CUE para búsqueda rápida
        $establecimientosPorCue = [];
        foreach ($establecimientos as $est) {
            $establecimientosPorCue[$est->cue] = $est;
        }
        
        // Contar modalidades por CUI (edificio)
        $modalidadesPorCui = \App\Models\Modalidad::join('establecimientos', 'modalidades.establecimiento_id', '=', 'establecimientos.id')
            ->join('edificios', 'establecimientos.edificio_id', '=', 'edificios.id')
            ->selectRaw('edificios.cui, COUNT(*) as total')
            ->groupBy('edificios.cui')
            ->pluck('total', 'cui')
            ->toArray();

        // Poblar datos
        $row = 2;
        foreach ($auditData as $audit) {
            $establecimiento = $establecimientosPorCue[$audit['cue']] ?? null;
            $cantEstablecimientos = $modalidadesPorCui[$audit['cui']] ?? 0;
            
            $sheet->setCellValue('A' . $row, $audit['cui']);
            $sheet->setCellValue('B' . $row, $audit['cue']);
            $sheet->setCellValue('C' . $row, $establecimiento ? $establecimiento->nombre : 'NO ENCONTRADO');
            $sheet->setCellValue('D' . $row, $cantEstablecimientos);
            $sheet->setCellValue('E' . $row, $audit['punto_partida']);
            $sheet->setCellValue('F' . $row, $audit['dist_circunf']);
            $sheet->setCellValue('G' . $row, $audit['radio_circ']);
            $sheet->setCellValue('H' . $row, $audit['distancia_camino']);
            $sheet->setCellValue('I' . $row, $audit['radio_camino']);
            $sheet->setCellValue('J' . $row, $audit['radio_sige']);
            $sheet->setCellValue('K' . $row, $audit['estado']);
            
            // Aplicar formato condicional al ESTADO
            $estadoCell = 'K' . $row;
            $estado = strtoupper($audit['estado']);
            
            if ($estado === 'COINCIDE') {
                $sheet->getStyle($estadoCell)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'C6EFCE']
                    ],
                    'font' => ['color' => ['rgb' => '006100'], 'bold' => true],
                ]);
            } elseif ($estado === 'DISTINTO') {
                $sheet->getStyle($estadoCell)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'FFEB9C']
                    ],
                    'font' => ['color' => ['rgb' => '9C6500'], 'bold' => true],
                ]);
            } elseif ($estado === 'INCONGRUENTE') {
                $sheet->getStyle($estadoCell)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'FFC7CE']
                    ],
                    'font' => ['color' => ['rgb' => '9C0006'], 'bold' => true],
                ]);
            }
            
            $row++;
        }

        // Auto Size Columns
        foreach (range('A', 'J') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Output
        $writer = new Xlsx($spreadsheet);
        $fileName = 'auditoria_radios_' . date('Y-m-d_His') . '.xlsx';
        
        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $fileName);
    }

    public function viewEdificio($id)
    {
        $this->selectedEdificio = Edificio::with(['establecimientos.modalidades'])->findOrFail($id);
        $this->showViewModal = true;
    }

    public function editEdificio($id)
    {
        $this->reset('editForm');
        
        $this->selectedEdificio = Edificio::with(['establecimientos'])->findOrFail($id);
        
        // Obtener el establecimiento cabecera
        $establecimientoCabecera = $this->selectedEdificio->establecimientos
            ->first(fn($e) => $e->cue_edificio_principal) 
            ?? $this->selectedEdificio->establecimientos->first();
        
        // Cargar datos en el formulario
        $this->editForm = [
            'cui' => $this->selectedEdificio->cui,
            'cue_edificio_principal' => $establecimientoCabecera->cue_edificio_principal ?? $establecimientoCabecera->cue ?? '',
            'establecimiento_cabecera' => $establecimientoCabecera->establecimiento_cabecera ?? '',
            'codigo_postal' => $this->selectedEdificio->codigo_postal,
            'localidad' => $this->selectedEdificio->localidad,
            'calle' => $this->selectedEdificio->calle,
            'numero_puerta' => $this->selectedEdificio->numero_puerta,
            'latitud' => $this->selectedEdificio->latitud,
            'longitud' => $this->selectedEdificio->longitud,
            'letra_zona' => $this->selectedEdificio->letra_zona ?? '',
            'zona_departamento' => $this->selectedEdificio->zona_departamento,
        ];
        
        $this->nombreEstablecimientoPrincipal = $establecimientoCabecera ? $establecimientoCabecera->nombre : '';
        
        $this->showEditModal = true;
    }

    public function updateEdificio(\App\Services\ActivityLogService $activityLogger)
    {
        // Convertir a mayúsculas
        $this->editForm['localidad'] = strtoupper($this->editForm['localidad']);
        $this->editForm['calle'] = strtoupper($this->editForm['calle']);
        $this->editForm['establecimiento_cabecera'] = strtoupper($this->editForm['establecimiento_cabecera']);

        // Actualizar Edificio
        $this->selectedEdificio->fill([
            'calle' => $this->editForm['calle'],
            'numero_puerta' => $this->editForm['numero_puerta'],
            'codigo_postal' => $this->editForm['codigo_postal'],
            'localidad' => $this->editForm['localidad'],
            'latitud' => $this->editForm['latitud'],
            'longitud' => $this->editForm['longitud'],
            'letra_zona' => $this->editForm['letra_zona'],
            'zona_departamento' => $this->editForm['zona_departamento'],
        ]);

        if ($this->selectedEdificio->isDirty()) {
            $activityLogger->logUpdate($this->selectedEdificio, "Actualización de Edificio", [
                'before' => array_intersect_key($this->selectedEdificio->getOriginal(), $this->selectedEdificio->getDirty()),
                'after' => $this->selectedEdificio->getDirty(),
            ]);
            $this->selectedEdificio->save();
        }

        // Actualizar establecimiento cabecera
        $nuevoCue = $this->editForm['cue_edificio_principal'];
        
        if ($nuevoCue) {
            $nuevoEstCabecera = Establecimiento::where('cue', $nuevoCue)->first();
            
            if ($nuevoEstCabecera) {
                // 1. Si pertenece a otro edificio, traerlo a este
                if ($nuevoEstCabecera->edificio_id !== $this->selectedEdificio->id) {
                    $nuevoEstCabecera->edificio_id = $this->selectedEdificio->id;
                    $activityLogger->logUpdate($nuevoEstCabecera, "Reasignación de Edificio (desde UI Edificios)", [
                        'before' => ['edificio_id' => $nuevoEstCabecera->getOriginal('edificio_id')],
                        'after' => ['edificio_id' => $this->selectedEdificio->id],
                    ]);
                    $nuevoEstCabecera->save();
                }

                // 2. Actualizar datos de cabecera en el establecimiento principal
                $nuevoEstCabecera->fill([
                    'cue_edificio_principal' => $nuevoCue,
                    'establecimiento_cabecera' => $this->editForm['establecimiento_cabecera'] ?: $nuevoEstCabecera->nombre,
                ]);
                
                if ($nuevoEstCabecera->isDirty()) {
                   $nuevoEstCabecera->save();
                }

                // 3. (Opcional) Actualizar TODOS los establecimientos del edificio para que apunten a esta nueva cabecera
                // Esto mantiene la consistencia de que todos en el edificio comparten la misma cabecera
                foreach ($this->selectedEdificio->refresh()->establecimientos as $est) {
                    if ($est->id !== $nuevoEstCabecera->id) {
                        $est->update([
                            'cue_edificio_principal' => $nuevoCue,
                            'establecimiento_cabecera' => $this->editForm['establecimiento_cabecera'] ?: $nuevoEstCabecera->nombre,
                        ]);
                    }
                }
            }
        }
        
        $this->showEditModal = false;
        $this->selectedEdificio = null;
        
        session()->flash('success', 'Edificio actualizado correctamente.');
    }

    public function clearFilters()
    {
        $this->reset([
            'search',
            'zonaFilter',
            'localidadFilter',
            'ambitoFilter',
        ]);
        $this->resetPage();
    }

    public function getActiveFiltersCountProperty()
    {
        $count = 0;
        if ($this->search) $count++;
        if ($this->zonaFilter) $count++;
        if ($this->localidadFilter) $count++;
        if ($this->ambitoFilter) $count++;
        return $count;
    }

    public function openCreateModal()
    {
        $this->reset('createForm');
        $this->showCreateModal = true;
    }

    public function createEdificio()
    {
        // Normalizar a mayúsculas antes de validar para que unique sea case-insensitive
        $this->createForm['cui'] = strtoupper(trim($this->createForm['cui'] ?? ''));

        $this->validate([
            'createForm.cui'              => 'required|string|max:50|unique:edificios,cui',
            'createForm.calle'            => 'required|string|max:255',
            'createForm.numero_puerta'    => 'nullable|string|max:20',
            'createForm.orientacion'      => 'nullable|string|max:50',
            'createForm.codigo_postal'    => 'nullable|integer',
            'createForm.localidad'        => 'required|string|max:255',
            'createForm.zona_departamento'=> 'required|string|max:255',
            'createForm.letra_zona'       => 'nullable|string|max:1',
            'createForm.latitud'          => 'nullable|numeric',
            'createForm.longitud'         => 'nullable|numeric',
            'createForm.te_voip'          => 'nullable|string|max:50',
        ], [
            'createForm.cui.required'              => 'El CUI es obligatorio.',
            'createForm.cui.unique'                => 'Ya existe un edificio con ese CUI.',
            'createForm.calle.required'            => 'La calle es obligatoria.',
            'createForm.localidad.required'        => 'La localidad es obligatoria.',
            'createForm.zona_departamento.required'=> 'El departamento es obligatorio.',
        ]);

        try {
            Edificio::create([
                'cui'              => $this->createForm['cui'],
                'calle'            => strtoupper($this->createForm['calle']),
                'numero_puerta'    => $this->createForm['numero_puerta'],
                'orientacion'      => $this->createForm['orientacion'] ?: null,
                'codigo_postal'    => $this->createForm['codigo_postal'] ?: null,
                'localidad'        => strtoupper($this->createForm['localidad']),
                'zona_departamento'=> strtoupper($this->createForm['zona_departamento']),
                'letra_zona'       => strtoupper($this->createForm['letra_zona']),
                'latitud'          => $this->createForm['latitud'] ?: null,
                'longitud'         => $this->createForm['longitud'] ?: null,
                'te_voip'          => $this->createForm['te_voip'] ?: null,
            ]);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            $this->addError('createForm.cui', 'Ya existe un edificio con ese CUI.');
            return;
        }

        $this->showCreateModal = false;
        $this->reset('createForm');
        session()->flash('success', 'Edificio creado correctamente.');
    }

    public function closeModals()
    {
        $this->showViewModal = false;
        $this->showEditModal = false;
        $this->showCreateModal = false;
        $this->selectedEdificio = null;
    }
}
