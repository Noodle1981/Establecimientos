<?php
namespace App\Http\Controllers\Publico;

use App\Http\Controllers\Controller;
use App\Models\Reporte;
use App\Http\Requests\Publico\StoreReporteRequest;
use Illuminate\Http\RedirectResponse;

class ReporteController extends Controller
{
    /**
     * Store a new report.
     */
    public function store(StoreReporteRequest $request): RedirectResponse
    {
        Reporte::create($request->validated());

        return back()->with('success', '¡Gracias! El reporte ha sido enviado con éxito.');
    }
}
