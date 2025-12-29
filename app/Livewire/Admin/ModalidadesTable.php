<?php

namespace App\Livewire\Admin;

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
        'categoria' => '',
        'ambito' => 'PUBLICO',
        'zona_departamento' => '',
        'localidad' => '',
        'calle' => '',
        'numero_puerta' => 'S/N',
        'validado' => false,
    ];

    // Datos del formulario de edición
    public $editForm = [
        'direccion_area' => '',
        'nivel_educativo' => '',
        'sector' => '',
        'categoria' => '',
        'ambito' => '',
        'validado' => false,
    ];

    protected $queryString = ['search', 'nivelFilter', 'ambitoFilter'];

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
                $q->where('nombre', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->nivelFilter) {
            $query->where('nivel_educativo', $this->nivelFilter);
        }

        if ($this->ambitoFilter) {
            $query->where('ambito', $this->ambitoFilter);
        }

        if ($this->showDeleted) {
            $query->onlyTrashed();
        }

        return view('livewire.admin.modalidades-table', [
            'modalidades' => $query->paginate(20),
            'niveles' => Modalidad::select('nivel_educativo')->distinct()->pluck('nivel_educativo'),
            'zonas' => Edificio::select('zona_departamento')->distinct()->orderBy('zona_departamento')->pluck('zona_departamento'),
        ]);
    }

    public function openCreateModal()
    {
        $this->reset('createForm');
        $this->createForm['ambito'] = 'PUBLICO';
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
                'zona_departamento' => $this->createForm['zona_departamento'],
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
        $this->selectedModalidad = Modalidad::findOrFail($id);
        $this->editForm = [
            'direccion_area' => $this->selectedModalidad->direccion_area,
            'nivel_educativo' => $this->selectedModalidad->nivel_educativo,
            'sector' => $this->selectedModalidad->sector,
            'categoria' => $this->selectedModalidad->categoria,
            'ambito' => $this->selectedModalidad->ambito,
            'validado' => $this->selectedModalidad->validado,
        ];
        $this->showEditModal = true;
    }

    public function updateModalidad()
    {
        $this->authorize('update', $this->selectedModalidad);
        $this->selectedModalidad->update($this->editForm);
        
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

    public function closeModals()
    {
        $this->showViewModal = false;
        $this->showEditModal = false;
        $this->showDeleteModal = false;
        $this->showCreateModal = false;
        $this->selectedModalidad = null;
    }
}
