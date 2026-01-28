<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use Livewire\Component;
use Livewire\WithPagination;

class ValidacionModalidadesTable extends Component
{
    use WithPagination;

    public $search = '';
    public $estadoFilter = '';
    
    // Modal state
    public $showCambiarEstadoModal = false;
    public $showHistorialModal = false;
    public $modalidadSeleccionada = null;
    public $nuevoEstado = '';
    public $observaciones = '';

    protected $queryString = ['search', 'estadoFilter'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingEstadoFilter()
    {
        $this->resetPage();
    }

    /**
     * Abrir modal para cambiar estado
     */
    public function abrirCambiarEstado($modalidadId)
    {
        $this->modalidadSeleccionada = Modalidad::with(['establecimiento', 'usuarioValidacion'])->find($modalidadId);
        $this->nuevoEstado = $this->modalidadSeleccionada->estado_validacion;
        $this->observaciones = '';
        $this->showCambiarEstadoModal = true;
    }

    /**
     * Cambiar estado de la modalidad
     */
    public function cambiarEstado()
    {
        $this->validate([
            'nuevoEstado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,BAJA,ELIMINADO',
            'observaciones' => $this->requiereObservaciones() ? 'required|min:10' : 'nullable',
        ], [
            'observaciones.required' => 'Las observaciones son obligatorias para este cambio de estado.',
            'observaciones.min' => 'Las observaciones deben tener al menos 10 caracteres.',
        ]);

        $this->modalidadSeleccionada->cambiarEstado(
            $this->nuevoEstado,
            $this->observaciones,
            auth()->id()
        );

        $this->showCambiarEstadoModal = false;
        $this->modalidadSeleccionada = null;
        
        session()->flash('message', 'Estado actualizado correctamente.');
    }

    /**
     * Determinar si el cambio de estado requiere observaciones
     */
    private function requiereObservaciones()
    {
        $estadoActual = $this->modalidadSeleccionada->estado_validacion;
        $cambiosQueRequierenObservaciones = [
            'CORREGIDO',
            'BAJA',
            'ELIMINADO',
        ];

        return in_array($this->nuevoEstado, $cambiosQueRequierenObservaciones) && 
               $estadoActual !== $this->nuevoEstado;
    }

    /**
     * Abrir modal de historial
     */
    public function abrirHistorial($modalidadId)
    {
        $this->modalidadSeleccionada = Modalidad::with(['historialEstados.user'])->find($modalidadId);
        $this->showHistorialModal = true;
    }

    /**
     * Cerrar modales
     */
    public function cerrarModales()
    {
        $this->showCambiarEstadoModal = false;
        $this->showHistorialModal = false;
        $this->modalidadSeleccionada = null;
        $this->nuevoEstado = '';
        $this->observaciones = '';
    }

    public function render()
    {
        $query = Modalidad::with(['establecimiento.edificio', 'usuarioValidacion']);

        // Búsqueda
        if ($this->search) {
            $query->whereHas('establecimiento', function ($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%');
            });
        }

        // Filtro por estado
        if ($this->estadoFilter) {
            $query->where('estado_validacion', $this->estadoFilter);
        }

        $modalidades = $query->orderBy('validado_en', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->paginate(20);

        // Contadores por estado
        $contadores = [
            'PENDIENTE' => Modalidad::where('estado_validacion', 'PENDIENTE')->count(),
            'CORRECTO' => Modalidad::where('estado_validacion', 'CORRECTO')->count(),
            'CORREGIDO' => Modalidad::where('estado_validacion', 'CORREGIDO')->count(),
            'BAJA' => Modalidad::where('estado_validacion', 'BAJA')->count(),
            'ELIMINADO' => Modalidad::where('estado_validacion', 'ELIMINADO')->count(),
        ];

        // Clases de badges por estado
        $badgeClasses = [
            'PENDIENTE' => 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CORRECTO' => 'bg-green-100 text-green-800 border-green-200',
            'CORREGIDO' => 'bg-blue-100 text-blue-800 border-blue-200',
            'BAJA' => 'bg-orange-100 text-orange-800 border-orange-200',
            'ELIMINADO' => 'bg-red-100 text-red-800 border-red-200',
        ];

        return view('livewire.administrativos.validacion-modalidades-table', [
            'modalidades' => $modalidades,
            'contadores' => $contadores,
            'badgeClasses' => $badgeClasses,
        ])->layout('layouts.app');
    }
}
