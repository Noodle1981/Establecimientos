<?php
namespace App\Http\Controllers\Administrativos;

use App\Http\Controllers\Controller;
use App\Models\Reporte;
use App\Http\Requests\Administrativos\UpdateReporteRequest;
use Inertia\Inertia;

class ReporteController extends Controller
{
    /**
     * Display a listing of reports.
     */
    public function index()
    {
        $reportes = Reporte::with('edificio:id,cui,localidad,calle,numero_puerta')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'pendientes' => Reporte::where('estado', 'PENDIENTE')->count(),
            'procesados' => Reporte::where('estado', 'PROCESADO')->count(),
            'descartados' => Reporte::where('estado', 'DESCARTADO')->count(),
        ];

        return Inertia::render('Administrativos/Reportes/Index', [
            'reportes' => $reportes,
            'stats' => $stats,
        ]);
    }

    /**
     * Update the status of a report.
     */
    public function update(UpdateReporteRequest $request, Reporte $reporte)
    {
        $reporte->update($request->validated());

        return back()->with('success', 'El estado del reporte ha sido actualizado.');
    }

    /**
     * Remove a report.
     */
    public function destroy(Reporte $reporte)
    {
        $reporte->delete();
        return back()->with('success', 'El reporte ha sido eliminado.');
    }
}
