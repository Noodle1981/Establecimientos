<?php

namespace App\Services;

use App\Models\Edificio;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class EdificioQueryService
{
    /**
     * Build a filtered query for edificios.
     */
    public function getFilteredQuery(Request $request): Builder
    {
        $query = Edificio::with(['establecimientos.modalidades', 'establecimientos.cabecera']);

        if ($searchCui = $request->input('search_cui')) {
            $query->where('cui', 'like', '%' . $searchCui . '%');
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('establecimientos', function ($qEst) use ($search) {
                    $qEst->where('nombre', 'like', '%' . $search . '%')
                         ->orWhere('cue', 'like', '%' . $search . '%');
                });
            });
        }

        if ($zona = $request->input('zona_departamento')) {
            $query->where('zona_departamento', $zona);
        }

        if ($localidad = $request->input('localidad')) {
            $query->where('localidad', $localidad);
        }

        if ($ambito = $request->input('ambito')) {
            $query->whereHas('modalidades', function ($q) use ($ambito) {
                $q->where('ambito', $ambito);
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        
        $allowedSorts = ['cui', 'calle', 'localidad', 'zona_departamento', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir);
        }

        return $query;
    }

    /**
     * Get unique options for filters.
     */
    public function getFilterOptions(): array
    {
        return [
            'zonas' => Edificio::select('zona_departamento')->distinct()->whereNotNull('zona_departamento')->orderBy('zona_departamento')->pluck('zona_departamento'),
            'localidades' => Edificio::select('localidad')->distinct()->whereNotNull('localidad')->orderBy('localidad')->pluck('localidad'),
            'ambitos' => ['PUBLICO', 'PRIVADO'],
        ];
    }
}
