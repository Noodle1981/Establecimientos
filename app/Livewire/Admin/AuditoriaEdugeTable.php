<?php

namespace App\Livewire\Admin;

use App\Models\AuditoriaEduge;
use App\Models\Establecimiento;
use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;

class AuditoriaEdugeTable extends Component
{
    use WithPagination;

    public $search = '';
    public $userFilter = '';
    public $dateFrom = '';
    public $dateTo = '';

    public $showViewModal = false;
    public $selectedAuditoria = null;

    protected $queryString = ['search', 'userFilter', 'dateFrom', 'dateTo'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $query = AuditoriaEduge::with(['establecimiento', 'user'])
            ->latest('fecha_visita');

        if ($this->search) {
            $query->whereHas('establecimiento', function ($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->userFilter) {
            $query->where('user_id', $this->userFilter);
        }

        if ($this->dateFrom) {
            $query->where('fecha_visita', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $query->where('fecha_visita', '<=', $this->dateTo);
        }

        return view('livewire.admin.auditoria-eduge-table', [
            'auditorias' => $query->paginate(15),
            'usuarios' => User::whereHas('auditorias')->get(),
        ]);
    }

    public function viewAuditoria($id)
    {
        $this->selectedAuditoria = AuditoriaEduge::with(['establecimiento', 'user'])->findOrFail($id);
        $this->showViewModal = true;
    }

    public function closeModals()
    {
        $this->showViewModal = false;
        $this->selectedAuditoria = null;
    }
}
