<?php

namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Services\DashboardMetricsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardMetricsService $metricsService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'ambito' => $request->input('ambito', 'TODOS'),
            'departamento' => $request->input('departamento', ''),
            'direccion_area' => $request->input('direccion_area', ''),
            'nivel_educativo' => $request->input('nivel_educativo', ''),
        ];

        return Inertia::render('Administrativos/Dashboard', [
            'filters' => $filters,
            'options' => $this->metricsService->getFilterOptions($filters),
            'chartData' => $this->metricsService->getChartData($filters),
        ]);
    }
}
