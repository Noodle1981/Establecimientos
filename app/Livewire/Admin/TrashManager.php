<?php

namespace App\Livewire\Admin;

use App\Models\Modalidad;
use App\Models\Establecimiento;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Log;

class TrashManager extends Component
{
    use WithPagination;

    public $search = '';
    public $showDeleteModal = false;
    public $selectedModalidad = null;

    protected $queryString = ['search'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function confirmDelete($id)
    {
        $this->selectedModalidad = Modalidad::withTrashed()->with(['establecimiento.edificio'])->findOrFail($id);
        $this->showDeleteModal = true;
    }

    public function closeModals()
    {
        $this->showDeleteModal = false;
        $this->selectedModalidad = null;
    }

    public function restore($id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);
        $modalidad->restore();

        session()->flash('success', 'Modalidad restaurada correctamente.');
    }

    public function forceDeleteEverything($id)
    {
        try {
            $modalidad = Modalidad::withTrashed()->with(['establecimiento.modalidades', 'establecimiento.auditorias'])->findOrFail($id);
            $establecimiento = $modalidad->establecimiento;

            if (!auth()->user()->isAdmin()) {
                abort(403);
            }

            // Borrado definitivo de todas las modalidades del establecimiento
            foreach ($establecimiento->modalidades()->withTrashed()->get() as $mod) {
                $mod->forceDelete();
            }

            // Borrado definitivo de auditorías
            foreach ($establecimiento->auditorias()->withTrashed()->get() as $aud) {
                $aud->forceDelete();
            }

            // Borrado definitivo del establecimiento (libera el CUE)
            $establecimiento->forceDelete();

            $this->showDeleteModal = false;
            $this->selectedModalidad = null;

            session()->flash('success', 'Establecimiento y todos sus datos asociados fueron eliminados permanentemente. El CUE ha sido liberado.');
        } catch (\Exception $e) {
            Log::error("Error en Force Delete: " . $e->getMessage());
            session()->flash('error', 'Error al eliminar: ' . $e->getMessage());
        }
    }

    public function render()
    {
        $query = Modalidad::onlyTrashed()
            ->with(['establecimiento.edificio'])
            ->whereHas('establecimiento', function ($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%');
            });

        return view('livewire.admin.trash-manager', [
            'modalidades' => $query->paginate(15)
        ])->layout('layouts.app');
    }
}
