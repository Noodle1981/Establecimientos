<?php

namespace App\Livewire\Administrativos;

use App\Models\Modalidad;
use App\Models\Edificio;
use App\Models\Establecimiento;
use Livewire\Component;
use Illuminate\Support\Facades\DB;

class AdministrativosDashboard extends Component
{
    /**
     * Get chart data for all visualizations
     */
    public function getChartDataProperty()
    {
        return [
            'modalidades' => $this->getModalidadesData(),
            'categorias' => $this->getCategoriasData(),
            'zonas' => $this->getZonasData(),
            'radios' => $this->getRadiosData(),
            'ambito' => $this->getAmbitoData(),
        ];
    }

    /**
     * Distribución por Modalidad Educativa
     */
    private function getModalidadesData()
    {
        $data = Modalidad::select('nivel_educativo', DB::raw('count(*) as total'))
            ->whereNotNull('nivel_educativo')
            ->groupBy('nivel_educativo')
            ->orderBy('total', 'desc')
            ->get();

        return [
            'labels' => $data->pluck('nivel_educativo')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    /**
     * Distribución por Categoría
     */
    private function getCategoriasData()
    {
        $data = Modalidad::select('categoria', DB::raw('count(*) as total'))
            ->whereNotNull('categoria')
            ->where('categoria', '!=', '')
            ->groupBy('categoria')
            ->orderBy('total', 'desc')
            ->limit(10) // Top 10 categorías
            ->get();

        return [
            'labels' => $data->pluck('categoria')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    /**
     * Distribución por Departamento/Zona
     */
    private function getZonasData()
    {
        $data = Edificio::select('zona_departamento', DB::raw('count(DISTINCT establecimientos.id) as total'))
            ->join('establecimientos', 'edificios.id', '=', 'establecimientos.edificio_id')
            ->whereNotNull('zona_departamento')
            ->where('zona_departamento', '!=', '')
            ->groupBy('zona_departamento')
            ->orderBy('total', 'desc')
            ->get();

        return [
            'labels' => $data->pluck('zona_departamento')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    /**
     * Distribución por Radio
     */
    private function getRadiosData()
    {
        $data = Modalidad::select('radio', DB::raw('count(*) as total'))
            ->whereNotNull('radio')
            ->where('radio', '!=', '')
            ->groupBy('radio')
            ->orderBy('radio')
            ->get();

        return [
            'labels' => $data->pluck('radio')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    /**
     * Distribución Público vs Privado
     */
    private function getAmbitoData()
    {
        $data = Modalidad::select('ambito', DB::raw('count(*) as total'))
            ->whereNotNull('ambito')
            ->groupBy('ambito')
            ->get();

        return [
            'labels' => $data->pluck('ambito')->toArray(),
            'values' => $data->pluck('total')->toArray(),
        ];
    }

    public function render()
    {
        return view('livewire.administrativos.administrativos-dashboard', [
            'chartData' => $this->chartData,
        ])->layout('layouts.app');
    }
}
