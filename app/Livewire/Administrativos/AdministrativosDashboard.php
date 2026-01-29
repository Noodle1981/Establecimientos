<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use App\Models\Edificio;
use App\Models\Establecimiento;
use Livewire\Component;
use Illuminate\Support\Facades\DB;


class AdministrativosDashboard extends Component
{
    public $ambito = 'TODOS';
    public $departamento = '';
    public $departamentos = [];

    public function mount()
    {
        $this->departamentos = Edificio::select('zona_departamento')
            ->distinct()
            ->whereNotNull('zona_departamento')
            ->where('zona_departamento', '!=', '')
            ->orderBy('zona_departamento')
            ->pluck('zona_departamento')
            ->toArray();
    }

    public function updatedAmbito() { $this->dispatch('update-charts', $this->chartData); }
    public function updatedDepartamento() { $this->dispatch('update-charts', $this->chartData); }

    public function getChartDataProperty()
    {
        return [
            'modalidades' => $this->getModalidadesData(),
            'categorias' => $this->getCategoriasData(),
            'zonas' => $this->getZonasData(),
            'radios' => $this->getRadiosData(),
            'ambito' => $this->getAmbitoData(),
            'stats' => $this->getStats(),
        ];
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
