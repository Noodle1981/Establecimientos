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
    public $modalidadIdSeleccionada = null; // Usar ID para mayor confiabilidad en rehidratación
    public $nuevoEstado = '';
    public $observaciones = '';
    public $nombreEstablecimientoSeleccionado = '';

    public function mount(Edificio $edificio)
    {
        $this->edificio = $edificio->load(['establecimientos.modalidades.historialEstados']);
    }

    /**
     * Abrir modal para cambiar estado
     */
    public function abrirCambiarEstado($modalidadId)
    {
        $modalidad = Modalidad::withTrashed()->with(['establecimiento'])->findOrFail($modalidadId);
        $this->modalidadIdSeleccionada = $modalidadId;
        $this->nuevoEstado = $modalidad->estado_validacion;
        $this->nombreEstablecimientoSeleccionado = $modalidad->establecimiento->nombre;
        $this->observaciones = '';
        $this->showCambiarEstadoModal = true;
    }

    /**
     * Determinar si el cambio de estado requiere observaciones
     */
    private function requiereObservaciones()
    {
        if (!$this->modalidadIdSeleccionada) return false;
        
        $modalidad = Modalidad::withTrashed()->find($this->modalidadIdSeleccionada);
        return $this->nuevoEstado === 'CORREGIDO' && 
               ($modalidad->estado_validacion ?? '') !== 'CORREGIDO';
    }

    /**
     * Cambiar estado de la modalidad
     */
    public function cambiarEstado()
    {
        $this->validate([
            'nuevoEstado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,REVISAR,FALTANTE_EDUGE,BAJA',
            'observaciones' => $this->requiereObservaciones() ? 'required|min:10' : 'nullable',
        ], [
            'observaciones.required' => 'Las observaciones son obligatorias para el estado CORREGIDO.',
            'observaciones.min' => 'Las observaciones deben tener al menos 10 caracteres.',
        ]);

        $modalidad = Modalidad::withTrashed()->findOrFail($this->modalidadIdSeleccionada);
        
        $modalidad->cambiarEstado(
            $this->nuevoEstado,
            $this->observaciones,
            auth()->id()
        );

        $this->showCambiarEstadoModal = false;
        $this->modalidadIdSeleccionada = null;
        
        // Refresh completo del edificio y sus relaciones para asegurar vista actualizada
        $this->edificio = Edificio::with(['establecimientos.modalidades.historialEstados'])->find($this->edificio->id);
        
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
            'REVISAR' => 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'FALTANTE_EDUGE' => 'bg-red-100 text-red-800 border-red-200',
            'BAJA' => 'bg-orange-100 text-orange-800 border-orange-200',
        ];

        return view('livewire.administrativos.auditacion-edificio-view', [
            'badgeClasses' => $badgeClasses
        ])->layout('layouts.app');
    }
}
