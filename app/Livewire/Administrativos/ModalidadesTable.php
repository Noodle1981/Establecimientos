<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use App\Models\Establecimiento;
use App\Models\Edificio;
use Livewire\Component;
use Livewire\WithPagination;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;


class ModalidadesTable extends Component
{
    use WithPagination;

    public $search = '';
    public $nivelFilter = '';
    public $ambitoFilter = '';
    public $radioFilter = '';
    public $categoriaFilter = '';
    public $zonaFilter = '';
    public $sectorFilter = '';
    public $direccionAreaFilter = '';
    public $estadoFilter = '';
    public $zonaLetraFilter = '';
    public $showDeleted = false;

    // Modales
    public $showViewModal = false;
    public $showEditModal = false;
    public $showDeleteModal = false;
    public $showCreateModal = false;
    public $selectedModalidad = null;

    // Mapeo Nivel → Dirección de Área
    public $nivelAreaMap = [
        'INICIAL' => 'NIVEL INICIAL',
        'PRIMARIO' => 'EDUCACIÓN PRIMARIA',
        'SECUNDARIO' => 'EDUCACIÓN SECUNDARIA',
        'ADULTOS' => 'EDUCACIÓN DE ADULTOS',
        'ESPECIAL' => 'EDUCACIÓN ESPECIAL',
        'SUPERIOR' => 'EDUCACIÓN SUPERIOR',
    ];

    // Formulario de creación
    public $createForm = [
        'nombre_establecimiento' => '',
        'cue' => '',
        'cui' => '',
        'establecimiento_cabecera' => '',
        'nivel_educativo' => '',
        'direccion_area' => '',
        'sector' => '',
        'radio' => '',
        'zona' => '',
        'observaciones' => '',
        'categoria' => '',
        'ambito' => 'PUBLICO',
        'zona_departamento' => '',
        'localidad' => '',
        'calle' => '',
        'numero_puerta' => 'S/N',
        'validado' => false,
        'latitud' => '',
        'longitud' => '',
    ];

    // Datos del formulario de edición (TODOS LOS CAMPOS)
    public $editForm = [
        // Establecimiento
        'nombre_establecimiento' => '',
        'cue' => '',
        'establecimiento_cabecera' => '',
        // Edificio
        'cui' => '',
        'calle' => '',
        'numero_puerta' => '',
        'localidad' => '',
        'zona_departamento' => '',
        // Modalidad
        'direccion_area' => '',
        'nivel_educativo' => '',
        'sector' => '',
        'radio' => '',
        'zona' => '',
        'observaciones' => '',
        'categoria' => '',
        'ambito' => '',
        'validado' => false,
        'latitud' => '',
        'longitud' => '',
    ];

    protected $queryString = [
        'search',
        'nivelFilter',
        'ambitoFilter',
        'radioFilter',
        'categoriaFilter',
        'zonaFilter',
        'sectorFilter',
        'direccionAreaFilter',
        'estadoFilter',
        'zonaLetraFilter',
        'showDeleted'
    ];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updated($propertyName)
    {
        if (in_array($propertyName, [
            'nivelFilter', 
            'ambitoFilter', 
            'radioFilter', 
            'categoriaFilter', 
            'zonaFilter', 
            'sectorFilter', 
            'direccionAreaFilter', 
            'estadoFilter', 
            'zonaLetraFilter',
            'showDeleted'
        ])) {
            $this->resetPage();
        }
    }

    public function updatedCreateFormNivelEducativo($value)
    {
        // Auto-asignar dirección de área según nivel
        if (isset($this->nivelAreaMap[$value])) {
            $this->createForm['direccion_area'] = $this->nivelAreaMap[$value];
        }
    }

    public function getFilteredQuery()
    {
        $query = Modalidad::with(['establecimiento.edificio']);

        if ($this->search) {
            $query->whereHas('establecimiento', function ($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%')
                  ->orWhereHas('edificio', function ($qEdificio) {
                      $qEdificio->where('cui', 'like', '%' . $this->search . '%');
                  });
            });
        }

        if ($this->nivelFilter) {
            $query->where('nivel_educativo', $this->nivelFilter);
        }

        if ($this->ambitoFilter) {
            $query->where('ambito', $this->ambitoFilter);
        }

        if (strlen($this->radioFilter) > 0) {
            $query->where('radio', $this->radioFilter);
        }

        if (strlen($this->categoriaFilter) > 0) {
            $query->where('categoria', 'like', '%' . $this->categoriaFilter . '%');
        }

        if (strlen($this->sectorFilter) > 0) {
            $query->where('sector', $this->sectorFilter);
        }

        if ($this->direccionAreaFilter) {
            $query->where('direccion_area', $this->direccionAreaFilter);
        }

        if ($this->estadoFilter) {
            if ($this->estadoFilter === 'VALIDADO') {
                $query->where('validado', true);
            } elseif ($this->estadoFilter === 'PENDIENTE') {
                $query->where('validado', false);
            }
        }

        // Clean potentially dirty input for Chimbas/Capital (trailing spaces)
        if ($this->zonaLetraFilter) {
            $query->where('zona', trim($this->zonaLetraFilter));
        }

        if ($this->zonaFilter) {
            $query->whereHas('establecimiento.edificio', function ($q) {
                // IMPORTANT: TRIM input to prevent mismatch with DB data
                $q->where('zona_departamento', trim($this->zonaFilter));
            });
        }

        if ($this->showDeleted) {
            $query->onlyTrashed();
        }

        return $query;
    }

    public function render()
    {
        return view('livewire.administrativos.modalidades-table', [
            'modalidades' => $this->getFilteredQuery()->paginate(20),
            'niveles' => Modalidad::select('nivel_educativo')->distinct()->pluck('nivel_educativo'),
            'zonas' => Edificio::select('zona_departamento')->distinct()->orderBy('zona_departamento')->pluck('zona_departamento'),
            'radios' => Modalidad::select('radio')->distinct()->whereNotNull('radio')->orderBy('radio')->pluck('radio'),
            'zonasLetras' => Modalidad::select('zona')->distinct()->whereNotNull('zona')->where('zona', '!=', '')->orderBy('zona')->pluck('zona'),
            'categorias' => Modalidad::select('categoria')->distinct()->whereNotNull('categoria')->orderBy('categoria')->pluck('categoria'),
            'sectores' => Modalidad::select('sector')->distinct()->whereNotNull('sector')->orderBy('sector')->pluck('sector'),
            'direccionesArea' => Modalidad::select('direccion_area')->distinct()->whereNotNull('direccion_area')->orderBy('direccion_area')->pluck('direccion_area'),
        ]);
    }

    public function exportExcel()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // --- 1. SET HEADERS ---
        $headers = [
            'A1' => 'CUE',
            'B1' => 'CUI',
            'C1' => 'NOMBRE ESTABLECIMIENTO',
            'D1' => 'NIVEL',
            'E1' => 'DIRECCIÓN DE ÁREA',
            'F1' => 'SECTOR',
            'G1' => 'ÁMBITO',
            'H1' => 'ZONA EDUC.',
            'I1' => 'RADIO',
            'J1' => 'CATEGORÍA',
            'K1' => 'DEPARTAMENTO',
            'L1' => 'LOCALIDAD',
            'M1' => 'CALLE',
            'N1' => 'N°',
            'O1' => 'ESTADO',
            'P1' => 'OBSERVACIONES',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style Headers
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'FE8204'] // Orange app color
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ];
        $sheet->getStyle('A1:P1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(20);

        // --- 2. POPULATE DATA ---
        // Get strict query (no pagination needed, but check memory for large sets)
        // Ideally chunk, but for <3000 rows, get() is fine.
        $rows = $this->getFilteredQuery()->get(); 
        
        $row = 2;
        foreach ($rows as $item) {
            $sheet->setCellValue('A' . $row, $item->establecimiento->cue);
            $sheet->setCellValue('B' . $row, $item->establecimiento->edificio->cui);
            $sheet->setCellValue('C' . $row, $item->establecimiento->nombre);
            $sheet->setCellValue('D' . $row, $item->nivel_educativo);
            $sheet->setCellValue('E' . $row, $item->direccion_area);
            $sheet->setCellValue('F' . $row, $item->sector);
            $sheet->setCellValue('G' . $row, $item->ambito);
            $sheet->setCellValue('H' . $row, $item->zona);
            $sheet->setCellValue('I' . $row, $item->radio);
            $sheet->setCellValue('J' . $row, $item->categoria);
            $sheet->setCellValue('K' . $row, $item->establecimiento->edificio->zona_departamento);
            $sheet->setCellValue('L' . $row, $item->establecimiento->edificio->localidad);
            $sheet->setCellValue('M' . $row, $item->establecimiento->edificio->calle);
            $sheet->setCellValue('N' . $row, $item->establecimiento->edificio->numero_puerta);
            $sheet->setCellValue('O' . $row, $item->validado ? 'VALIDADO' : 'PENDIENTE');
            $sheet->setCellValue('P' . $row, $item->observaciones);
            
            // Conditional formatting for status
            if ($item->validado) {
                $sheet->getStyle('O' . $row)->getFont()->getColor()->setARGB('008000'); // Green
            } else {
                $sheet->getStyle('O' . $row)->getFont()->getColor()->setARGB('FF0000'); // Red
            }

            $row++;
        }

        // --- 3. AUTO SIZE COLUMNS ---
        foreach (range('A', 'P') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // --- 4. OUTPUT ---
        $writer = new Xlsx($spreadsheet);
        $fileName = 'establecimientos_' . date('Y-m-d_His') . '.xlsx';
        
        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $fileName);
    }


    public function openCreateModal()
    {
        $this->reset('createForm');
        $this->createForm['ambito'] = 'PUBLICO';
        $this->createForm['radio'] = '';
        $this->createForm['zona'] = '';
        $this->createForm['numero_puerta'] = 'S/N';
        $this->showCreateModal = true;
    }

    public function createEstablecimiento()
    {
        // Validaciones
        $this->validate([
            'createForm.nombre_establecimiento' => 'required|string',
            'createForm.cue' => ['required', 'regex:/^(\d{9}|PROV)$/'],
            'createForm.cui' => ['required', 'regex:/^(\d{7}|PROV)$/'],
            'createForm.nivel_educativo' => 'required',
            'createForm.ambito' => 'required',
            'createForm.zona_departamento' => 'required',
            'createForm.zona' => 'nullable|string|max:1',
        ], [
            'createForm.cue.regex' => 'El CUE debe tener 9 dígitos o ser "PROV"',
            'createForm.cui.regex' => 'El CUI debe tener 7 dígitos o ser "PROV"',
        ]);

        // Convertir a mayúsculas
        $this->createForm['nombre_establecimiento'] = strtoupper($this->createForm['nombre_establecimiento']);
        $this->createForm['establecimiento_cabecera'] = strtoupper($this->createForm['establecimiento_cabecera']);
        $this->createForm['categoria'] = strtoupper($this->createForm['categoria']);
        $this->createForm['calle'] = strtoupper($this->createForm['calle']);
        $this->createForm['localidad'] = strtoupper($this->createForm['localidad']);

        // Crear o encontrar edificio
        $edificio = Edificio::firstOrCreate(
            ['cui' => $this->createForm['cui']],
            [
                'calle' => $this->createForm['calle'],
                'numero_puerta' => $this->createForm['numero_puerta'],
                'localidad' => $this->createForm['localidad'],
                'localidad' => $this->createForm['localidad'],
                'zona_departamento' => $this->createForm['zona_departamento'],
                'latitud' => $this->createForm['latitud'],
                'longitud' => $this->createForm['longitud'],
            ]
        );

        // Crear o encontrar establecimiento
        $establecimiento = Establecimiento::firstOrCreate(
            ['cue' => $this->createForm['cue']],
            [
                'edificio_id' => $edificio->id,
                'nombre' => $this->createForm['nombre_establecimiento'],
                'establecimiento_cabecera' => $this->createForm['establecimiento_cabecera'],
                'cue_edificio_principal' => $this->createForm['cue'],
            ]
        );

        // Crear modalidad
        Modalidad::create([
            'establecimiento_id' => $establecimiento->id,
            'direccion_area' => $this->createForm['direccion_area'],
            'nivel_educativo' => $this->createForm['nivel_educativo'],
            'sector' => $this->createForm['sector'],
            'radio' => $this->createForm['radio'],
            'zona' => strtoupper($this->createForm['zona'] ?? ''),
            'categoria' => $this->createForm['categoria'],
            'ambito' => $this->createForm['ambito'],
            'validado' => $this->createForm['validado'],
        ]);

        $this->showCreateModal = false;
        session()->flash('success', 'Establecimiento creado correctamente.');
        $this->reset('createForm');
    }

    public function viewModalidad($id)
    {
        $this->selectedModalidad = Modalidad::withTrashed()->with(['establecimiento.edificio'])->findOrFail($id);
        $this->showViewModal = true;
    }

    public function editModalidad($id)
    {
        $this->reset('editForm');
        
        $this->selectedModalidad = Modalidad::findOrFail($id);
        $this->selectedModalidad->load(['establecimiento.edificio']);
        
        \Illuminate\Support\Facades\Log::info("EDITANDO MODALIDAD: {$id} - CARGANDO: {$this->selectedModalidad->establecimiento->nombre}");

        // Cargar TODOS los datos en el formulario
        $this->editForm = [
            // Establecimiento
            'nombre_establecimiento' => $this->selectedModalidad->establecimiento->nombre,
            'cue' => $this->selectedModalidad->establecimiento->cue,
            'establecimiento_cabecera' => $this->selectedModalidad->establecimiento->establecimiento_cabecera ?? '',
            // Edificio
            'cui' => $this->selectedModalidad->establecimiento->edificio->cui,
            'calle' => $this->selectedModalidad->establecimiento->edificio->calle ?? '',
            'numero_puerta' => $this->selectedModalidad->establecimiento->edificio->numero_puerta ?? 'S/N',
            'localidad' => $this->selectedModalidad->establecimiento->edificio->localidad ?? '',
            'zona_departamento' => $this->selectedModalidad->establecimiento->edificio->zona_departamento,
            // Modalidad
            'direccion_area' => $this->selectedModalidad->direccion_area,
            'nivel_educativo' => $this->selectedModalidad->nivel_educativo,
            'sector' => $this->selectedModalidad->sector,
            'radio' => $this->selectedModalidad->radio,
            'zona' => $this->selectedModalidad->zona,
            'observaciones' => $this->selectedModalidad->observaciones,
            'categoria' => $this->selectedModalidad->categoria,
            'ambito' => $this->selectedModalidad->ambito,
            'validado' => $this->selectedModalidad->validado,
            'latitud' => $this->selectedModalidad->establecimiento->edificio->latitud,
            'longitud' => $this->selectedModalidad->establecimiento->edificio->longitud,
        ];
        
        $this->showEditModal = true;
    }

    public function updateModalidad(\App\Services\ActivityLogService $activityLogger)
    {
        try {
            $this->authorize('update', $this->selectedModalidad);

            // Convertir a mayúsculas
            $this->editForm['nombre_establecimiento'] = strtoupper($this->editForm['nombre_establecimiento']);
            $this->editForm['establecimiento_cabecera'] = strtoupper($this->editForm['establecimiento_cabecera']);
            $this->editForm['categoria'] = strtoupper($this->editForm['categoria']);
            $this->editForm['calle'] = strtoupper($this->editForm['calle']);
            $this->editForm['localidad'] = strtoupper($this->editForm['localidad']);

            // Actualizar Edificio
            $edificio = $this->selectedModalidad->establecimiento->edificio;
            $edificio->fill([
                'calle' => $this->editForm['calle'],
                'numero_puerta' => $this->editForm['numero_puerta'],
                'localidad' => $this->editForm['localidad'],
                'zona_departamento' => $this->editForm['zona_departamento'],
                'latitud' => $this->editForm['latitud'],
                'longitud' => $this->editForm['longitud'],
            ]);

            if ($edificio->isDirty()) {
                $activityLogger->logUpdate($edificio, "Actualización de Edificio desde Modalidades", [
                    'before' => array_intersect_key($edificio->getOriginal(), $edificio->getDirty()),
                    'after' => $edificio->getDirty(),
                ]);
                $edificio->save();
            }

            // Actualizar Establecimiento
            $establecimiento = $this->selectedModalidad->establecimiento;
            $establecimiento->fill([
                'nombre' => $this->editForm['nombre_establecimiento'],
                'establecimiento_cabecera' => $this->editForm['establecimiento_cabecera'],
            ]);

            if ($establecimiento->isDirty()) {
                $activityLogger->logUpdate($establecimiento, "Actualización de Establecimiento desde Modalidades", [
                    'before' => array_intersect_key($establecimiento->getOriginal(), $establecimiento->getDirty()),
                    'after' => $establecimiento->getDirty(),
                ]);
                $establecimiento->save();
            }

            // Actualizar Modalidad
            $this->selectedModalidad->fill([
                'direccion_area' => $this->editForm['direccion_area'],
                'nivel_educativo' => $this->editForm['nivel_educativo'],
                'sector' => $this->editForm['sector'],
                'radio' => $this->editForm['radio'],
                'zona' => strtoupper($this->editForm['zona'] ?? ''),
                'observaciones' => $this->editForm['observaciones'] ?? null,
                'categoria' => $this->editForm['categoria'],
                'ambito' => $this->editForm['ambito'],
                'validado' => $this->editForm['validado'],
            ]);

            if ($this->selectedModalidad->isDirty()) {
                $dirty = $this->selectedModalidad->getDirty();
                
                // Si validado u observaciones cambiaron, los quitamos de la lista de cosas para loguear
                if (array_key_exists('validado', $dirty)) unset($dirty['validado']);
                if (array_key_exists('observaciones', $dirty)) unset($dirty['observaciones']);
                
                // Si queda algo más aparte de validado, entonces logueamos
                if (!empty($dirty)) {
                    $original = $this->selectedModalidad->getOriginal();
                    // Necesitamos el before correcto, excluyendo validado
                    $before = array_intersect_key($original, $dirty);

                    $activityLogger->logUpdate($this->selectedModalidad, "Actualización de Modalidad", [
                        'before' => $before,
                        'after' => $dirty,
                    ]);
                }

                // Guardamos SIEMPRE, haya log o no
                $this->selectedModalidad->save();
            }
            
            $this->showEditModal = false;
            $this->selectedModalidad = null;
            
            session()->flash('success', 'Modalidad actualizada correctamente.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error actualizando modalidad: " . $e->getMessage());
            session()->flash('error', 'Error al guardar: ' . $e->getMessage());
        }
    }

    public function confirmDelete($id)
    {
        $this->selectedModalidad = Modalidad::findOrFail($id);
        $this->showDeleteModal = true;
    }

    public function softDelete()
    {
        $this->authorize('delete', $this->selectedModalidad);
        $this->selectedModalidad->delete();
        
        $this->showDeleteModal = false;
        $this->selectedModalidad = null;

        session()->flash('success', 'Modalidad eliminada correctamente.');
    }

    public function forceDelete($id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $modalidad);
        $modalidad->forceDelete();

        session()->flash('success', 'Modalidad eliminada permanentemente.');
    }

    public function restore($id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);
        $this->authorize('restore', $modalidad);
        $modalidad->restore();

        session()->flash('success', 'Modalidad restaurada correctamente.');
    }

    /**
     * Clear all active filters
     */
    public function clearFilters()
    {
        $this->reset([
            'search',
            'nivelFilter',
            'ambitoFilter',
            'radioFilter',
            'categoriaFilter',
            'zonaFilter',
            'sectorFilter',
            'direccionAreaFilter',
            'estadoFilter',
            'zonaLetraFilter',
        ]);
        $this->resetPage();
    }

    /**
     * Get count of active filters
     */
    public function getActiveFiltersCountProperty()
    {
        $count = 0;
        if ($this->search) $count++;
        if ($this->nivelFilter) $count++;
        if ($this->ambitoFilter) $count++;
        if ($this->radioFilter) $count++;
        if ($this->categoriaFilter) $count++;
        if ($this->zonaFilter) $count++;
        if ($this->sectorFilter) $count++;
        if ($this->direccionAreaFilter) $count++;
        if ($this->estadoFilter) $count++;
        if ($this->zonaLetraFilter) $count++;
        return $count;
    }

    public function closeModals()
    {
        $this->showViewModal = false;
        $this->showEditModal = false;
        $this->showDeleteModal = false;
        $this->showCreateModal = false;
        $this->selectedModalidad = null;
    }
}
