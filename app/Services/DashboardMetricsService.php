<?php

namespace App\Services;

use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardMetricsService
{
    /**
     * Get select dropdown options.
     */
    public function getFilterOptions(array $filters): array
    {
        $ambito = (string) ($filters['ambito'] ?? 'TODOS');
        if (empty($ambito)) {
            $ambito = 'TODOS';
        }
        $direccionArea = isset($filters['direccion_area']) ? (string) $filters['direccion_area'] : null;

        return [
            'departamentos' => Cache::remember('dashboard-departamentos', 3600, function () {
                return Edificio::select('zona_departamento')
                    ->distinct()
                    ->whereNotNull('zona_departamento')
                    ->where('zona_departamento', '!=', '')
                    ->orderBy('zona_departamento')
                    ->pluck('zona_departamento');
            }),
            'direcciones_area' => $this->getDireccionesArea($ambito),
            'niveles_educativos' => $this->getNivelesEducativos($direccionArea, $ambito),
        ];
    }

    /**
     * Get complete chart and KPI data.
     */
    public function getChartData(array $filters): array
    {
        $cacheKey = 'dashboard_data_react_'.md5(json_encode($filters));

        return Cache::remember($cacheKey, 300, function () use ($filters) {
            return [
                'modalidades' => $this->getModalidadesData($filters),
                'categorias' => $this->getCategoriasData($filters),
                'zonas' => $this->getZonasData($filters),
                'radios' => $this->getRadiosData($filters),
                'ambito' => $this->getAmbitoData($filters),
                'stats' => $this->getStats($filters),
            ];
        });
    }

    private function getDireccionesArea(?string $ambito = 'TODOS'): Collection
    {
        $ambito = (! empty($ambito)) ? $ambito : 'TODOS';
        $cacheKey = 'dashboard-direcciones-'.md5($ambito);

        return Cache::remember($cacheKey, 3600, function () use ($ambito) {
            $query = Modalidad::select('direccion_area')->distinct()
                ->whereNotNull('direccion_area')
                ->where('direccion_area', '!=', '');

            if ($ambito !== 'TODOS') {
                $query->where('ambito', $ambito);
            }

            return $query->orderBy('direccion_area')->pluck('direccion_area');
        });
    }

    private function getNivelesEducativos(?string $direccion_area = null, ?string $ambito = 'TODOS'): Collection|array
    {
        if (empty($direccion_area)) {
            return [];
        }

        $ambito = (! empty($ambito)) ? $ambito : 'TODOS';
        $cacheKey = 'dashboard-niveles-'.md5($direccion_area.'_'.$ambito);

        return Cache::remember($cacheKey, 3600, function () use ($direccion_area, $ambito) {
            $query = Modalidad::select('nivel_educativo')->distinct()
                ->where('direccion_area', $direccion_area)
                ->whereNotNull('nivel_educativo')
                ->where('nivel_educativo', '!=', '');

            if ($ambito !== 'TODOS') {
                $query->where('ambito', $ambito);
            }

            return $query->orderBy('nivel_educativo')->pluck('nivel_educativo');
        });
    }

    private function applyFilters($query, array $filters, string $context = 'modalidad')
    {
        if ($filters['ambito'] !== 'TODOS') {
            if ($context === 'modalidad') {
                $query->where('ambito', $filters['ambito']);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn ($q) => $q->where('ambito', $filters['ambito']));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn ($q) => $q->where('ambito', $filters['ambito']));
            } elseif ($context === 'join_edificio') {
                $query->where('modalidades.ambito', $filters['ambito']);
            }
        }

        if (! empty($filters['departamento'])) {
            if ($context === 'modalidad') {
                $query->whereHas('establecimiento.edificio', fn ($q) => $q->where('zona_departamento', $filters['departamento']));
            } elseif ($context === 'edificio' || $context === 'join_edificio') {
                $query->where('edificios.zona_departamento', $filters['departamento']);
            } elseif ($context === 'establecimiento') {
                $query->whereHas('edificio', fn ($q) => $q->where('zona_departamento', $filters['departamento']));
            }
        }

        if (! empty($filters['direccion_area'])) {
            if ($context === 'modalidad' || $context === 'join_edificio') {
                $query->where('direccion_area', $filters['direccion_area']);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn ($q) => $q->where('direccion_area', $filters['direccion_area']));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn ($q) => $q->where('direccion_area', $filters['direccion_area']));
            }
        }

        if (! empty($filters['nivel_educativo'])) {
            if ($context === 'modalidad' || $context === 'join_edificio') {
                $query->where('nivel_educativo', $filters['nivel_educativo']);
            } elseif ($context === 'edificio') {
                $query->whereHas('establecimientos.modalidades', fn ($q) => $q->where('nivel_educativo', $filters['nivel_educativo']));
            } elseif ($context === 'establecimiento') {
                $query->whereHas('modalidades', fn ($q) => $q->where('nivel_educativo', $filters['nivel_educativo']));
            }
        }

        return $query;
    }

    private function getStats(array $filters): array
    {
        $estQuery = Establecimiento::query();
        $this->applyFilters($estQuery, $filters, 'establecimiento');

        $modQuery = Modalidad::query();
        $this->applyFilters($modQuery, $filters, 'modalidad');

        $edQuery = Edificio::query();
        $this->applyFilters($edQuery, $filters, 'edificio');

        return [
            'total_establecimientos' => $estQuery->count(),
            'total_modalidades' => $modQuery->count(),
            'total_edificios' => $edQuery->count(),
        ];
    }

    private function getModalidadesData(array $filters): array
    {
        $column = $filters['ambito'] === 'PRIVADO' ? 'nivel_educativo' : 'direccion_area';
        $query = Modalidad::select($column, DB::raw('count(*) as total'))->whereNotNull($column);
        $this->applyFilters($query, $filters, 'modalidad');
        $data = $query->groupBy($column)->orderBy('total', 'desc')->get();

        return ['labels' => $data->pluck($column), 'values' => $data->pluck('total')];
    }

    private function getCategoriasData(array $filters): array
    {
        $query = Modalidad::select('categoria', DB::raw('count(*) as total'))->whereNotNull('categoria')->where('categoria', '!=', '');
        $this->applyFilters($query, $filters, 'modalidad');
        $data = $query->groupBy('categoria')->orderBy('total', 'desc')->limit(10)->get();

        return ['labels' => $data->pluck('categoria'), 'values' => $data->pluck('total')];
    }

    private function getZonasData(array $filters): array
    {
        $query = Edificio::select(
            'zona_departamento',
            DB::raw("count(DISTINCT CASE WHEN modalidades.ambito = 'PUBLICO' THEN establecimientos.id END) as publicos"),
            DB::raw("count(DISTINCT CASE WHEN modalidades.ambito = 'PRIVADO' THEN establecimientos.id END) as privados"),
            DB::raw('count(DISTINCT establecimientos.id) as total')
        )
            ->join('establecimientos', 'edificios.id', '=', 'establecimientos.edificio_id')
            ->join('modalidades', 'establecimientos.id', '=', 'modalidades.establecimiento_id')
            ->whereNull('modalidades.deleted_at')
            ->whereNull('establecimientos.deleted_at')
            ->whereNull('edificios.deleted_at')
            ->whereNotNull('zona_departamento')->where('zona_departamento', '!=', '');

        $this->applyFilters($query, $filters, 'join_edificio');
        $data = $query->groupBy('zona_departamento')->orderBy('total', 'desc')->get();

        return [
            'labels' => $data->pluck('zona_departamento'),
            'values' => $data->pluck('total'),
            'publicos' => $data->pluck('publicos'),
            'privados' => $data->pluck('privados'),
        ];
    }

    private function getRadiosData(array $filters): array
    {
        $query = Modalidad::select('radio', DB::raw('count(*) as total'))->whereNotNull('radio')->where('radio', '!=', '');
        $this->applyFilters($query, $filters, 'modalidad');
        $data = $query->groupBy('radio')->orderBy('radio')->get();

        return ['labels' => $data->pluck('radio'), 'values' => $data->pluck('total')];
    }

    private function getAmbitoData(array $filters): array
    {
        $query = Modalidad::select('ambito', DB::raw('count(*) as total'))->whereNotNull('ambito');
        $this->applyFilters($query, $filters, 'modalidad');
        $data = $query->groupBy('ambito')->orderBy('total', 'desc')->get();

        return ['labels' => $data->pluck('ambito'), 'values' => $data->pluck('total')];
    }
}
