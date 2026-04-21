<?php
namespace App\Http\Controllers\Publico;

use App\Http\Controllers\Controller;
use App\Models\Reporte;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    /**
     * Store a new report.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'edificio_id' => 'nullable|exists:edificios,id',
            'tipo' => 'required|string',
            'descripcion' => 'required|string|min:10',
            'nombre_remitente' => 'nullable|string|max:255',
            'email_remitente' => 'nullable|email|max:255',
        ]);

        Reporte::create($validated);

        return back()->with('success', '¡Gracias! El reporte ha sido enviado con éxito y será revisado por el equipo administrativo.');
    }
}
