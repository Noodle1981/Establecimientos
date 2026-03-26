<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use App\Models\Edificio;
use App\Models\Establecimiento;
use Livewire\Component;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;


class AdministrativosDashboard extends Component
{
    public $ambito = 'TODOS';
    public $departamento = '';
    public $direccion_area = '';
    public $nivel_educativo = '';
    public $departamentos = [];
    public $direcciones_area = [];
    public $niveles_educativos = [];

    public function mount()
    {
        $this->departamentos = Cache::remember('dashboard-departamentos', 3600, function () {
            return Edificio::select('zona_departamento')
                ->distinct()
                ->whereNotNull('zona_departamento')
                ->where('zona_departamento', '!=', '')
                ->orderBy('zona_departamento')
                ->pluck('zona_departamento')
                ->toArray();
        });

        $this->loadDireccionesArea();
    }

    private function loadDireccionesArea()
    {
        $ambitoCacheKey = 'dashboard-direcciones-' . md5($this->ambito);

        $this->direcciones_area = Cache::remember($ambitoCacheKey, 3600, function () {
            $query = Modalidad::select('direccion_area')->distinct()
                ->whereNotNull('direccion_area')
                ->where('direccion_area', '!=', '');

            if ($this->ambito !== 'TODOS') {
                $query->where('ambito', $this->ambito);
            }

            return $query->orderBy('direccion_area')
                ->pluck('direccion_area')
                ->toArray();
        });
    }

    public function updatedAmbito() 
    { 
        $this->loadDireccionesArea();

        // Si la dirección seleccionada ya no existe en el nuevo ámbito, resetearla
        if (!empty($this->direccion_area) && !in_array($this->direccion_area, $this->direcciones_area)) {
            $this->direccion_area = '';
            $this->nivel_educativo = '';
            $this->niveles_educativos = [];
        } else {
            $this->loadNivelesEducativos();
        }

        $this->dispatch('update-charts', $this->chartData); 
    }

    public function updatedDepartamento() { $this->dispatch('update-charts', $this->chartData); }
    
    public function updatedDireccionArea() 
    { 
        $this->loadNivelesEducativos();
        $this->nivel_educativo = ''; // Reset sub-filter
        $this->dispatch('update-charts', $this->chartData); 
    }

    public function updatedNivelEducativo() { $this->dispatch('update-charts', $this->chartData); }

    private function loadNivelesEducativos()
    {
        if (empty($this->direccion_area)) {
            $this->niveles_educativos = [];
            return;
        }

        $query = Modalidad::select('nivel_educativo')->distinct()
            ->where('direccion_area', $this->direccion_area)
            ->whereNotNull('nivel_educativo')
            ->where('nivel_educativo', '!=', '');
        
        if ($this->ambito !== 'TODOS') {
            $query->where('ambito', $this->ambito);
        }

        $this->niveles_educativos = $query->orderBy('nivel_educativo')
            ->pluck('nivel_educativo')
            ->toArray();
    }

    public function getChartDataProperty()
    {
        $cacheKey = 'dashboard_data_' . md5(json_encode([
            $this->ambito, $this->departamento, $this->direccion_area, $this->nivel_educativo
        ]));

        return Cache::remember($cacheKey, 300, function () {
            return [
                'modalidades' => $this->getModalidadesData(),
                'categorias' => $this->getCategoriasData(),
                'zonas' => $this->getZonasData(),
                'radios' => $this->getRadiosData(),
                'ambito' => $this->getAmbitoData(),
                'stats' => $this->getStats(),
            ];
        });
    }
    
    // Contexts: 'modalidad' (default), 'edificio', 'establecimiento', 'join_edificio'
    private function applyFilters($query, $context = 'modalidad')
    {
        // 1. Ámbito Filter
        if ($this->ambito !== 'TODOS') {
            if ($context === 'modalidad') {
                $query->where('ambito', $this->ambito);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn($q) => $q->where('ambito', $this->ambito));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn($q) => $q->where('ambito', $this->ambito));
            } elseif ($context === 'join_edificio') {
                 // Assumes 'modalidades' is joined
                $query->where('modalidades.ambito', $this->ambito);
            }
        }

        // 2. Departamento Filter
        if (!empty($this->departamento)) {
            if ($context === 'modalidad') {
                $query->whereHas('establecimiento.edificio', fn($q) => $q->where('zona_departamento', $this->departamento));
            } elseif ($context === 'edificio' || $context === 'join_edificio') {
                $query->where('edificios.zona_departamento', $this->departamento);
            } elseif ($context === 'establecimiento') {
                $query->whereHas('edificio', fn($q) => $q->where('zona_departamento', $this->departamento));
            }
        }

        // 3. Dirección de Área Filter
        if (!empty($this->direccion_area)) {
            if ($context === 'modalidad' || $context === 'join_edificio') {
                $query->where('direccion_area', $this->direccion_area);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn($q) => $q->where('direccion_area', $this->direccion_area));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn($q) => $q->where('direccion_area', $this->direccion_area));
            }
        }

        // 4. Nivel Educativo (Modalidad específica) Filter
        if (!empty($this->nivel_educativo)) {
            if ($context === 'modalidad' || $context === 'join_edificio') {
                $query->where('nivel_educativo', $this->nivel_educativo);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn($q) => $q->where('nivel_educativo', $this->nivel_educativo));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn($q) => $q->where('nivel_educativo', $this->nivel_educativo));
            }
        }

        return $query;
    }

    private function getStats()
    {
        $estQuery = Establecimiento::query();
        $this->applyFilters($estQuery, 'establecimiento');

        $modQuery = Modalidad::query();
        $this->applyFilters($modQuery, 'modalidad');

        $edQuery = Edificio::query();
        $this->applyFilters($edQuery, 'edificio');

        return [
            'total_establecimientos' => $estQuery->count(),
            'total_modalidades' => $modQuery->count(),
            'total_edificios' => $edQuery->count(),
        ];
    }

    private function getModalidadesData()
    {
        $column = $this->ambito === 'PRIVADO' ? 'nivel_educativo' : 'direccion_area';

        $query = Modalidad::select($column, DB::raw('count(*) as total'))
            ->whereNotNull($column);
            
        $this->applyFilters($query, 'modalidad');
            
        $data = $query->groupBy($column)->orderBy('total', 'desc')->get();

        return [
            'labels' => $data->pluck($column)->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    private function getCategoriasData()
    {
        $query = Modalidad::select('categoria', DB::raw('count(*) as total'))
            ->whereNotNull('categoria')->where('categoria', '!=', '');

        $this->applyFilters($query, 'modalidad');

        $data = $query->groupBy('categoria')->orderBy('total', 'desc')->limit(10)->get();

        return [
            'labels' => $data->pluck('categoria')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    private function getZonasData()
    {
        // Use 'join_edificio' context because we are joining tables manually
        $query = Edificio::select('zona_departamento', DB::raw('count(DISTINCT establecimientos.id) as total'))
            ->join('establecimientos', 'edificios.id', '=', 'establecimientos.edificio_id')
            ->join('modalidades', 'establecimientos.id', '=', 'modalidades.establecimiento_id')
            ->whereNull('modalidades.deleted_at')
            ->whereNotNull('zona_departamento')->where('zona_departamento', '!=', '');

        $this->applyFilters($query, 'join_edificio');

        $data = $query->groupBy('zona_departamento')->orderBy('total', 'desc')->get();

        return [
            'labels' => $data->pluck('zona_departamento')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    private function getRadiosData()
    {
        $query = Modalidad::select('radio', DB::raw('count(*) as total'))
            ->whereNotNull('radio')->where('radio', '!=', '');

        $this->applyFilters($query, 'modalidad');

        $data = $query->groupBy('radio')->orderBy('radio')->get();

        return [
            'labels' => $data->pluck('radio')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    private function getAmbitoData()
    {
        $query = Modalidad::select('ambito', DB::raw('count(*) as total'))
            ->whereNotNull('ambito');
            
        $this->applyFilters($query, 'modalidad');

        $data = $query->groupBy('ambito')->orderBy('total', 'desc')->get();

        return [
            'labels' => $data->pluck('ambito')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    public function render()
    {
        return view('livewire.administrativos.administrativos-dashboard', [
            'chartData' => $this->chartData,
        ])->layout('layouts.app', ['containerClass' => 'w-full h-[calc(100vh-65px)] p-0 max-w-full']);
    }
}
