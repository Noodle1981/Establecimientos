<?php

namespace App\Livewire\Administrativos;

use App\Models\Edificio;
use App\Models\Modalidad;
use Livewire\Component;

class AuditacionEdificioView extends Component
{
    public Edificio $edificio;
    
    // Modal state for validation
    public $showCambiarEstadoModal = false;
    public $modalidadSeleccionada = null;
    public $nuevoEstado = '';
    public $observaciones = '';

    public function mount(Edificio $edificio)
    {
        $this->edificio = $edificio->load(['establecimientos.modalidades']);
    }

    /**
     * Abrir modal para cambiar estado
     */
    public function abrirCambiarEstado($modalidadId)
    {
        $this->modalidadSeleccionada = Modalidad::withTrashed()->with(['establecimiento'])->find($modalidadId);
        $this->nuevoEstado = $this->modalidadSeleccionada->estado_validacion;
        $this->observaciones = '';
        $this->showCambiarEstadoModal = true;
    }

    /**
     * Determinar si el cambio de estado requiere observaciones
     */
    private function requiereObservaciones()
    {
        return $this->nuevoEstado === 'CORREGIDO' && 
               ($this->modalidadSeleccionada->estado_validacion ?? '') !== 'CORREGIDO';
    }

    /**
     * Cambiar estado de la modalidad
     */
    public function cambiarEstado()
    {
        $this->validate([
            'nuevoEstado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,FALTANTE_EDUGE,BAJA',
            'observaciones' => $this->requiereObservaciones() ? 'required|min:10' : 'nullable',
        ]);

        $this->modalidadSeleccionada->cambiarEstado(
            $this->nuevoEstado,
            $this->observaciones,
            auth()->id()
        );

        $this->showCambiarEstadoModal = false;
        $this->modalidadSeleccionada = null;
        
        // Refresh здание
        $this->edificio->load(['establecimientos.modalidades']);
        
        session()->flash('message', 'Estado actualizado correctamente.');
    }

    public function toggleCorrecto($id)
    {
        $modalidad = Modalidad::withTrashed()->findOrFail($id);
        
        $modalidad->cambiarEstado(
            'CORRECTO',
            'Validación rápida: Correcto según EDUGE',
            auth()->id()
        );

        $this->edificio->load(['establecimientos.modalidades']);
        session()->flash('message', 'Validado como CORRECTO.');
    }

    public function cerrarModales()
    {
        $this->showCambiarEstadoModal = false;
        $this->modalidadSeleccionada = null;
    }

    public function render()
    {
        // Clases de badges por estado (Reutilizadas para consistencia)
        $badgeClasses = [
            'PENDIENTE' => 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CORRECTO' => 'bg-green-100 text-green-800 border-green-200',
            'CORREGIDO' => 'bg-blue-100 text-blue-800 border-blue-200',
            'FALTANTE_EDUGE' => 'bg-red-100 text-red-800 border-red-200',
            'BAJA' => 'bg-orange-100 text-orange-800 border-orange-200',
        ];

        return view('livewire.administrativos.auditacion-edificio-view', [
            'badgeClasses' => $badgeClasses
        ])->layout('layouts.app');
    }
}
