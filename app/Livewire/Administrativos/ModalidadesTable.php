<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use App\Models\Establecimiento;
use App\Models\Edificio;
use Livewire\Component;
use Livewire\WithPagination;

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
        'showDeleted'
    ];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatedCreateFormNivelEducativo($value)
    {
        // Auto-asignar dirección de área según nivel
        if (isset($this->nivelAreaMap[$value])) {
            $this->createForm['direccion_area'] = $this->nivelAreaMap[$value];
        }
    }

    public function render()
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

        if ($this->zonaFilter) {
            $query->whereHas('establecimiento.edificio', function ($q) {
                $q->where('zona_departamento', $this->zonaFilter);
            });
        }

        if ($this->showDeleted) {
            $query->onlyTrashed();
        }

        return view('livewire.administrativos.modalidades-table', [
            'modalidades' => $query->paginate(20),
            'niveles' => Modalidad::select('nivel_educativo')->distinct()->pluck('nivel_educativo'),
            'zonas' => Edificio::select('zona_departamento')->distinct()->orderBy('zona_departamento')->pluck('zona_departamento'),
            'radios' => Modalidad::select('radio')->distinct()->whereNotNull('radio')->orderBy('radio')->pluck('radio'),
            'categorias' => Modalidad::select('categoria')->distinct()->whereNotNull('categoria')->orderBy('categoria')->pluck('categoria'),
            'sectores' => Modalidad::select('sector')->distinct()->whereNotNull('sector')->orderBy('sector')->pluck('sector'),
            'direccionesArea' => Modalidad::select('direccion_area')->distinct()->whereNotNull('direccion_area')->orderBy('direccion_area')->pluck('direccion_area'),
        ]);
    }

    public function openCreateModal()
    {
        $this->reset('createForm');
        $this->createForm['ambito'] = 'PUBLICO';
        $this->createForm['radio'] = '';
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
            ]
        );

        // Crear modalidad
        Modalidad::create([
            'establecimiento_id' => $establecimiento->id,
            'direccion_area' => $this->createForm['direccion_area'],
            'nivel_educativo' => $this->createForm['nivel_educativo'],
            'sector' => $this->createForm['sector'],
            'radio' => $this->createForm['radio'],
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
        $this->selectedModalidad = Modalidad::with(['establecimiento.edificio'])->findOrFail($id);
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
            'categoria' => $this->selectedModalidad->categoria,
            'ambito' => $this->selectedModalidad->ambito,
            'validado' => $this->selectedModalidad->validado,
            'latitud' => $this->selectedModalidad->establecimiento->edificio->latitud,
            'longitud' => $this->selectedModalidad->establecimiento->edificio->longitud,
        ];
        
        $this->showEditModal = true;
    }

    public function updateModalidad()
    {
        $this->authorize('update', $this->selectedModalidad);

        // Convertir a mayúsculas
        $this->editForm['nombre_establecimiento'] = strtoupper($this->editForm['nombre_establecimiento']);
        $this->editForm['establecimiento_cabecera'] = strtoupper($this->editForm['establecimiento_cabecera']);
        $this->editForm['categoria'] = strtoupper($this->editForm['categoria']);
        $this->editForm['calle'] = strtoupper($this->editForm['calle']);
        $this->editForm['localidad'] = strtoupper($this->editForm['localidad']);

        // Actualizar Edificio
        $this->selectedModalidad->establecimiento->edificio->update([
            'calle' => $this->editForm['calle'],
            'numero_puerta' => $this->editForm['numero_puerta'],
            'localidad' => $this->editForm['localidad'],
            'localidad' => $this->editForm['localidad'],
            'zona_departamento' => $this->editForm['zona_departamento'],
            'latitud' => $this->editForm['latitud'],
            'longitud' => $this->editForm['longitud'],
        ]);

        // Actualizar Establecimiento
        $this->selectedModalidad->establecimiento->update([
            'nombre' => $this->editForm['nombre_establecimiento'],
            'establecimiento_cabecera' => $this->editForm['establecimiento_cabecera'],
        ]);

        // Actualizar Modalidad
        $this->selectedModalidad->update([
            'direccion_area' => $this->editForm['direccion_area'],
            'nivel_educativo' => $this->editForm['nivel_educativo'],
            'sector' => $this->editForm['sector'],
            'radio' => $this->editForm['radio'],
            'categoria' => $this->editForm['categoria'],
            'ambito' => $this->editForm['ambito'],
            'validado' => $this->editForm['validado'],
        ]);
        
        $this->showEditModal = false;
        $this->selectedModalidad = null;
        
        session()->flash('success', 'Modalidad actualizada correctamente.');
    }

    public function confirmDelete($id)
    {
        $this->selectedModalidad = Modalidad::findOrFail($id);
        $this->showDeleteModal = true;
    }

    public function softDelete()
    {
        $this->authorize('delete', Modalidad::class);
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
