<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditoriaEduge;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    public function downloadIndividual($id)
    {
        $auditoria = AuditoriaEduge::with(['establecimiento', 'user'])->findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.auditoria-individual', compact('auditoria'));
        
        $filename = 'auditoria_' . ($auditoria->establecimiento?->cue ?? 'S-CUE') . '_' . $auditoria->fecha_visita . '.pdf';
        
        return $pdf->download($filename);
    }

    public function downloadGeneral(Request $request)
    {
        $query = AuditoriaEduge::with(['establecimiento', 'user'])->latest('fecha_visita');

        if ($request->date_from) {
            $query->where('fecha_visita', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('fecha_visita', '<=', $request->date_to);
        }

        $auditorias = $query->get();
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;

        $pdf = Pdf::loadView('pdf.auditoria-general', compact('auditorias', 'dateFrom', 'dateTo'));
        
        return $pdf->download('informe_general_auditorias.pdf');
    }
}
