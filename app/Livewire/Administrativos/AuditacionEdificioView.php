<?php

namespace App\Livewire\Administrativos;

use App\Models\Edificio;
use App\Models\Modalidad;
use Livewire\Component;
use Livewire\Attributes\Layout;
use Illuminate\Support\Facades\Auth;

class AuditacionEdificioView extends Component
{
    public Edificio $edificio;
    
    // Modal state for validation
    public $showCambiarEstadoModal = false;
    public $modalidadIdSeleccionada = null; 
    public $editModalidadId = null; // Para edición inline
    public $nuevoEstado = '';
    public $observaciones = '';
    public $nombreEstablecimientoSeleccionado = '';
    
    // Bulk Action state
    public $showBulkAction = false;
    public $bulkScope = ''; // 'EDIFICIO' or 'ESTABLECIMIENTO'
    public $bulkTargetId = null;
    public $bulkEstado = 'CORRECTO';
    public $bulkObservaciones = '';

    public function mount(Edificio $edificio)
    {
        $this->edificio = $edificio->load(['establecimientos.modalidades.historialEstados']);
    }

    /**
     * Abrir edición inline para una modalidad
     */
    public function abrirCambiarEstado($modalidadId)
    {
        $modalidad = Modalidad::withTrashed()->with(['establecimiento'])->findOrFail($modalidadId);
        
        // Si ya estamos editando esta, la cerramos
        if ($this->editModalidadId === $modalidadId) {
            $this->cerrarModales();
            return;
        }

        $this->editModalidadId = $modalidadId;
        $this->modalidadIdSeleccionada = $modalidadId;
        $this->nuevoEstado = $modalidad->estado_validacion;
        $this->nombreEstablecimientoSeleccionado = $modalidad->establecimiento->nombre;
        $this->observaciones = $modalidad->observaciones;
        
        // Mantener compatibilidad si se prefiere modal en algún momento
        // $this->showCambiarEstadoModal = true; 
    }

    /**
     * Determinar si el cambio de estado requiere observaciones
     */
    private function requiereObservaciones()
    {
        return in_array($this->nuevoEstado, ['CORREGIDO', 'REVISAR', 'BAJA', 'ELIMINADO']);
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
            Auth::id()
        );

        $this->showCambiarEstadoModal = false;
        $this->editModalidadId = null;
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
            Auth::id()
        );

        $this->edificio->load(['establecimientos.modalidades']);
        session()->flash('message', 'Validado como CORRECTO.');
    }

    public function cerrarModales()
    {
        $this->showCambiarEstadoModal = false;
        $this->showBulkAction = false;
        $this->editModalidadId = null;
        $this->modalidadIdSeleccionada = null;
        $this->nuevoEstado = '';
        $this->observaciones = '';
        $this->bulkScope = '';
        $this->bulkTargetId = null;
    }

    /**
     * Abrir panel de acción masiva
     */
    public function abrirBulkAction($scope, $targetId = null)
    {
        $this->cerrarModales();
        $this->bulkScope = $scope;
        $this->bulkTargetId = $targetId;
        $this->bulkEstado = 'CORRECTO';
        $this->bulkObservaciones = '';
        $this->showBulkAction = true;
    }

    /**
     * Aplicar validación masiva según el scope
     */
    public function aplicarValidacionMasiva()
    {
        $this->validate([
            'bulkEstado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,REVISAR,FALTANTE_EDUGE,BAJA',
            'bulkObservaciones' => in_array($this->bulkEstado, ['CORREGIDO', 'REVISAR', 'BAJA', 'ELIMINADO']) ? 'required|min:10' : 'nullable',
        ]);

        $query = Modalidad::withTrashed();

        if ($this->bulkScope === 'EDIFICIO') {
            $query->whereHas('establecimiento', function($q) {
                $q->where('edificio_id', $this->edificio->id);
            });
            $msg = "Se validó todo el edificio como {$this->bulkEstado}.";
        } elseif ($this->bulkScope === 'ESTABLECIMIENTO') {
            $query->where('establecimiento_id', $this->bulkTargetId);
            $msg = "Se validó el establecimiento correctamente.";
        }

        $modalidades = $query->get();

        /** @var \App\Models\Modalidad $mod */
        foreach ($modalidades as $mod) {
            $mod->cambiarEstado(
                $this->bulkEstado,
                $this->bulkObservaciones ?: "Validación masiva ({$this->bulkScope})",
                Auth::id()
            );
        }

        $this->cerrarModales();
        $this->refreshEdificio();
        session()->flash('message', $msg);
    }

    /**
     * Refrescar datos del edificio
     */
    private function refreshEdificio()
    {
        $this->edificio = Edificio::with(['establecimientos.modalidades.historialEstados'])->find($this->edificio->id);
    }

    /**
     * Metadata centralizada para estados de validación
     */
    public function getEstadosMetadataProperty()
    {
        return [
            'PENDIENTE' => [
                'badge' => 'Pendiente',
                'icon' => 'fa-clock',
                'color' => 'text-yellow-600',
                'bg' => 'bg-yellow-50',
                'border' => 'border-yellow-200'
            ],
            'CORRECTO' => [
                'badge' => 'Correcto',
                'icon' => 'fa-check-circle',
                'color' => 'text-green-600',
                'bg' => 'bg-green-50',
                'border' => 'border-green-200'
            ],
            'CORREGIDO' => [
                'badge' => 'Corregido',
                'icon' => 'fa-sync-alt',
                'color' => 'text-blue-600',
                'bg' => 'bg-blue-50',
                'border' => 'border-blue-200'
            ],
            'REVISAR' => [
                'badge' => 'Revisar',
                'icon' => 'fa-search-plus',
                'color' => 'text-indigo-600',
                'bg' => 'bg-indigo-50',
                'border' => 'border-indigo-200'
            ],
            'FALTANTE_EDUGE' => [
                'badge' => 'Faltante',
                'icon' => 'fa-exclamation-circle',
                'color' => 'text-red-600',
                'bg' => 'bg-red-50',
                'border' => 'border-red-200'
            ],
            'BAJA' => [
                'badge' => 'Baja',
                'icon' => 'fa-minus-circle',
                'color' => 'text-gray-600',
                'bg' => 'bg-gray-50',
                'border' => 'border-gray-200'
            ],
        ];
    }

    #[Layout('layouts.app')]
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
        ]);
    }
}
