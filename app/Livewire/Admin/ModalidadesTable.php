<?php

namespace App\Livewire\Admin;

use App\Models\Modalidad;
use Livewire\Component;
use Livewire\WithPagination;

class ModalidadesTable extends Component
{
    use WithPagination;

    public $search = '';
    public $nivelFilter = '';
    public $ambitoFilter = '';
    public $showDeleted = false;

    protected $queryString = ['search', 'nivelFilter', 'ambitoFilter'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $query = Modalidad::with(['establecimiento.edificio']);

        // Aplicar filtros
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

        // Mostrar eliminados o activos
        if ($this->showDeleted) {
            $query->onlyTrashed();
        }

        return view('livewire.admin.modalidades-table', [
            'modalidades' => $query->paginate(20),
            'niveles' => Modalidad::select('nivel_educativo')->distinct()->pluck('nivel_educativo'),
        ]);
    }

    public function softDelete($id)
    {
        $this->authorize('delete', Modalidad::class);

        $modalidad = Modalidad::findOrFail($id);
        $modalidad->delete();

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
}
