<?php

namespace App\Services;

use App\Models\Modalidad;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ModalidadQueryService
{
    /**
     * Build a filtered query for modalidades.
     */
    public function getFilteredQuery(Request $request): Builder
    {
        $query = Modalidad::with(['establecimiento.edificio']);

        // Search logic
        if ($search = $request->input('search')) {
            $query->whereHas('establecimiento', function ($q) use ($search) {
                $q->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('cue', 'like', '%' . $search . '%')
                  ->orWhereHas('edificio', function ($qEdificio) use ($search) {
                      $qEdificio->where('cui', 'like', '%' . $search . '%');
                  });
            });
        }

        // Apply filters
        foreach (['nivel_educativo', 'ambito', 'direccion_area', 'radio', 'sector'] as $filter) {
            if ($value = $request->input($filter)) {
                $query->where($filter, $value);
            }
        }

        // Zona / Departamento filter (from Edificio)
        if ($zonaDepto = $request->input('zona_departamento')) {
            $query->whereHas('establecimiento.edificio', function ($q) use ($zonaDepto) {
                $q->where('zona_departamento', $zonaDepto);
            });
        }

        // Status filter
        if ($request->input('estado') === 'VALIDADO') {
            $query->where('validado', true);
        } elseif ($request->input('estado') === 'PENDIENTE') {
            $query->where('validado', false);
        }

        // Missing instruments filter
        if ($request->boolean('missing')) {
            $query->where(function($q) {
                $q->whereNull('inst_legal_radio')->orWhere('inst_legal_radio', '')
                  ->orWhereNull('inst_legal_categoria')->orWhere('inst_legal_categoria', '')
                  ->orWhereNull('inst_legal_creacion')->orWhere('inst_legal_creacion', '');
            });
        }

        return $query;
    }

    /**
     * Get unique options for filters.
     */
    public function getFilterOptions(): array
    {
        return [
            'niveles' => Modalidad::select('nivel_educativo')->distinct()->whereNotNull('nivel_educativo')->orderBy('nivel_educativo')->pluck('nivel_educativo'),
            'ambitos' => Modalidad::select('ambito')->distinct()->whereNotNull('ambito')->pluck('ambito'),
            'areas' => Modalidad::select('direccion_area')->distinct()->whereNotNull('direccion_area')->orderBy('direccion_area')->pluck('direccion_area'),
            'zonas' => \App\Models\Edificio::select('zona_departamento')->distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento'),
            'radios' => Modalidad::select('radio')->distinct()->whereNotNull('radio')->orderBy('radio')->pluck('radio'),
            'sectores' => Modalidad::select('sector')->distinct()->whereNotNull('sector')->orderBy('sector')->pluck('sector'),
        ];
    }
}
