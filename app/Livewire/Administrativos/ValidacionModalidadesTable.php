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
    
    // Filtro Ver Eliminados
    public $verEliminados = false;

    // Filtros adicionales
    public $departamentoFilter = '';
    public $nivelFilter = '';
    public $ambitoFilter = '';

    // Modal state
    public $showCambiarEstadoModal = false;
    public $showHistorialModal = false;
    public $modalidadSeleccionada = null;
    public $nuevoEstado = '';
    public $observaciones = '';

    protected $queryString = [
        'search' => ['except' => ''],
        'estadoFilter' => ['except' => ''],
        'departamentoFilter' => ['except' => ''],
        'nivelFilter' => ['except' => ''],
        'ambitoFilter' => ['except' => ''],
        'verEliminados' => ['except' => false],
    ];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingEstadoFilter()
    {
        $this->resetPage();
    }

    public function updatingDepartamentoFilter()
    {
        $this->resetPage();
    }

    public function updatingNivelFilter()
    {
        $this->resetPage();
    }

    public function updatingAmbitoFilter()
    {
        $this->resetPage();
    }

    public function updatingVerEliminados()
    {
        $this->resetPage();
    }

    /**
     * Abrir modal para cambiar estado
     */
    public function abrirCambiarEstado($modalidadId)
    {
        $this->modalidadSeleccionada = Modalidad::withTrashed()->with(['establecimiento', 'usuarioValidacion'])->find($modalidadId);
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
            'nuevoEstado' => 'required|in:PENDIENTE,CORRECTO,CORREGIDO,FALTANTE_EDUGE,BAJA',
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
            'FALTANTE_EDUGE',
            'BAJA',
        ];

        return in_array($this->nuevoEstado, $cambiosQueRequierenObservaciones) && 
               $estadoActual !== $this->nuevoEstado;
    }

    /**
     * Abrir modal de historial
     */
    public function abrirHistorial($modalidadId)
    {
        $this->modalidadSeleccionada = Modalidad::withTrashed()->with(['historialEstados.user'])->find($modalidadId);
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

    /**
     * Aplicar filtros a una consulta
     */
    private function aplicarFiltros($query)
    {
        // Filtro de Eliminados vs Activos
        if ($this->verEliminados) {
            $query->onlyTrashed();
        } else {
            // Nota: Si usas Modalidad::withTrashed() como base, aquí debes filtrar
            // Si usas Modalidad::query() (que excluye trashed por defecto), no necesitas esto.
            // PERO en render() se usa withTrashed() inicialmente.
            // Para ser seguro, forzamos:
            $query->withoutTrashed();
        }

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

        // Filtros de Modalidad
        if ($this->nivelFilter) {
            $query->where('nivel_educativo', $this->nivelFilter);
        }
        if ($this->ambitoFilter) {
            $query->where('ambito', $this->ambitoFilter);
        }

        // Filtros de Ubicación (Edificio)
        if ($this->departamentoFilter) {
            $query->whereHas('establecimiento.edificio', function ($q) {
                $q->where('zona_departamento', $this->departamentoFilter);
            });
        }
        
        return $query;
    }

    /**
     * Generar Reporte PDF
     */
    public function generarReporte()
    {
        $query = Modalidad::withTrashed()->with(['establecimiento.edificio', 'usuarioValidacion']);
        $query = $this->aplicarFiltros($query);

        $resultados = $query->orderBy('validado_en', 'desc')->get();

        // Calcular contadores para el reporte
        $contadores = [
            'total' => $resultados->count(),
            'CORRECTO' => $resultados->where('estado_validacion', 'CORRECTO')->count(),
            'CORREGIDO' => $resultados->where('estado_validacion', 'CORREGIDO')->count(),
            'FALTANTE_EDUGE' => $resultados->where('estado_validacion', 'FALTANTE_EDUGE')->count(),
            'PENDIENTE' => $resultados->where('estado_validacion', 'PENDIENTE')->count(),
            'BAJA' => $resultados->where('estado_validacion', 'BAJA')->count(),
        ];

        // Calcular porcentaje de avance
        $total = array_sum($contadores);
        $pendientes = $contadores['PENDIENTE'];
        $procesados = $total - $pendientes;
        $porcentajeAvance = $total > 0 ? round(($procesados / $total) * 100, 1) : 0;

        // Anomalías (todo lo que no es CORRECTO)
        $anomalias = $resultados->filter(function($item) {
            return $item->estado_validacion !== 'CORRECTO';
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.reporte-auditoria', [
            'anomalias' => $anomalias,
            'contadores' => $contadores,
            'porcentajeAvance' => $porcentajeAvance,
            'filtros' => [
                'departamento' => $this->departamentoFilter,
                'nivel' => $this->nivelFilter,
                'ambito' => $this->ambitoFilter,
            ]
        ]);

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'reporte-auditoria-' . date('Y-m-d') . '.pdf');
    }

    public function render()
    {
        $query = Modalidad::withTrashed()->with(['establecimiento.edificio', 'usuarioValidacion']);
        $query = $this->aplicarFiltros($query);

        $modalidades = $query->orderBy('validado_en', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->paginate(20);

        // Contadores globales (respetando filtros actuales)
        $kpiQuery = Modalidad::withTrashed()->with(['establecimiento.edificio']);
        
        if ($this->search) {
            $kpiQuery->whereHas('establecimiento', function ($q) {
                $q->where('nombre', 'like', '%' . $this->search . '%')
                  ->orWhere('cue', 'like', '%' . $this->search . '%');
            });
        }
        if ($this->nivelFilter) $kpiQuery->where('nivel_educativo', $this->nivelFilter);
        if ($this->ambitoFilter) $kpiQuery->where('ambito', $this->ambitoFilter);
        if ($this->departamentoFilter) {
            $kpiQuery->whereHas('establecimiento.edificio', function ($q) {
                $q->where('zona_departamento', $this->departamentoFilter);
            });
        }

        $rawCounts = $kpiQuery->selectRaw('estado_validacion, count(*) as count')
                              ->groupBy('estado_validacion')
                              ->pluck('count', 'estado_validacion')
                              ->toArray();

        $contadores = [
            'PENDIENTE' => $rawCounts['PENDIENTE'] ?? 0,
            'CORRECTO' => $rawCounts['CORRECTO'] ?? 0,
            'CORREGIDO' => $rawCounts['CORREGIDO'] ?? 0,
            'FALTANTE_EDUGE' => $rawCounts['FALTANTE_EDUGE'] ?? 0,
            'BAJA' => $rawCounts['BAJA'] ?? 0,
        ];

        // Calcular porcentaje de avance
        $total = array_sum($contadores);
        $pendientes = $contadores['PENDIENTE'];
        $procesados = $total - $pendientes;
        $porcentajeAvance = $total > 0 ? round(($procesados / $total) * 100, 1) : 0;

        // Obtener listas para filtros (Optimización: Cachear si es posible, o simple query)
        $niveles = \App\Models\Modalidad::distinct()->whereNotNull('nivel_educativo')->orderBy('nivel_educativo')->pluck('nivel_educativo');
        $departamentos = \App\Models\Edificio::distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento');
        $ambitos = \App\Models\Modalidad::distinct()->whereNotNull('ambito')->orderBy('ambito')->pluck('ambito');

        // Clases de badges por estado
        $badgeClasses = [
            'PENDIENTE' => 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CORRECTO' => 'bg-green-100 text-green-800 border-green-200',
            'CORREGIDO' => 'bg-blue-100 text-blue-800 border-blue-200',
            'FALTANTE_EDUGE' => 'bg-red-100 text-red-800 border-red-200',
            'BAJA' => 'bg-orange-100 text-orange-800 border-orange-200',
        ];

        return view('livewire.administrativos.validacion-modalidades-table', [
            'modalidades' => $modalidades,
            'contadores' => $contadores,
            'porcentajeAvance' => $porcentajeAvance,
            'badgeClasses' => $badgeClasses,
            'opciones' => [
                'niveles' => $niveles,
                'departamentos' => $departamentos,
                'ambitos' => $ambitos,
            ]
        ])->layout('layouts.app');
    }
}
