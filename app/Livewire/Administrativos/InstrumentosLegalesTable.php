<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use Livewire\Component;
use Livewire\WithPagination;

class InstrumentosLegalesTable extends Component
{
    use WithPagination;

    public $search = '';
    public $filterMissing = false;
    
    // Columns to manage (snake_case from database)
    public $cols = [
        'inst_legal_radio' => 'Inst. Legal Radio',
        'inst_legal_categoria' => 'Inst. Legal Categoría',
        'inst_legal_creacion' => 'Inst. Legal Creación',
    ];

    // Editing state
    public $editingId = null;
    public $editForm = [
        'inst_legal_radio' => '',
        'inst_legal_categoria' => '',
        'inst_legal_creacion' => '',
    ];

    protected $queryString = ['search', 'filterMissing'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function startEdit($id)
    {
        $mod = Modalidad::findOrFail($id);
        $this->editingId = $id;
        $this->editForm = [
            'inst_legal_radio' => $mod->inst_legal_radio,
            'inst_legal_categoria' => $mod->inst_legal_categoria,
            'inst_legal_creacion' => $mod->inst_legal_creacion,
        ];
    }

    public function cancelEdit()
    {
        $this->editingId = null;
        $this->reset('editForm');
    }

    public function save()
    {
        if (!$this->editingId) return;

        $mod = Modalidad::findOrFail($this->editingId);
        
        $mod->inst_legal_radio = $this->editForm['inst_legal_radio'];
        $mod->inst_legal_categoria = $this->editForm['inst_legal_categoria'];
        $mod->inst_legal_creacion = $this->editForm['inst_legal_creacion'];
        
        $mod->save();

        session()->flash('success', 'Instrumentos Legales actualizados correctamente.');
        $this->cancelEdit();
    }

    public function render()
    {
        $query = Modalidad::query()
            ->with(['establecimiento', 'establecimiento.edificio']); // Eager load relationships

        if ($this->search) {
            $query->whereHas('establecimiento', function($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->filterMissing) {
            $query->where(function($q) {
                // Check null or empty
                $q->whereNull('inst_legal_radio')
                  ->orWhere('inst_legal_radio', '')
                  ->orWhere('inst_legal_radio', 'like', 'Sin Inst%') // Typo tolerant
                  
                  ->orWhereNull('inst_legal_categoria')
                  ->orWhere('inst_legal_categoria', '')
                  ->orWhere('inst_legal_categoria', 'like', 'Sin Inst%')
                  
                  ->orWhereNull('inst_legal_creacion')
                  ->orWhere('inst_legal_creacion', '')
                  ->orWhere('inst_legal_creacion', 'like', 'Sin Inst%');
            });
        }

        return view('livewire.administrativos.instrumentos-legales-table', [
            'modalidades' => $query->paginate(20)
        ]);
    }
}
