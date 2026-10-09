<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\EstablecimientoResource;
use App\Models\Establecimiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EstablecimientoApiController extends Controller
{
    /**
     * List establishments with extensive search and filtering capabilities.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Establecimiento::query()->with([
            'edificio',
            'modalidades',
        ]);

        // 1. Filtrar por CUE (exacto o parcial)
        if ($cue = $request->input('cue')) {
            $query->where('cue', 'like', "%{$cue}%");
        }

        // 2. Filtrar por Nombre del establecimiento
        if ($nombre = $request->input('nombre')) {
            $query->where('nombre', 'like', "%{$nombre}%");
        }

        // 3. Búsqueda libre unificada (CUE, Nombre o CUI)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('cue', 'like', "%{$search}%")
                    ->orWhereHas('edificio', function ($qEdificio) use ($search) {
                        $qEdificio->where('cui', 'like', "%{$search}%");
                    });
            });
        }

        // 4. Filtrar por Departamento / Zona
        $depto = $request->input('departamento') ?? $request->input('zona_departamento');
        if (! empty($depto)) {
            $query->whereHas('edificio', function ($q) use ($depto) {
                $q->where('zona_departamento', 'like', "%{$depto}%");
            });
        }

        // 5. Filtrar por Localidad
        if ($localidad = $request->input('localidad')) {
            $query->whereHas('edificio', function ($q) use ($localidad) {
                $q->where('localidad', 'like', "%{$localidad}%");
            });
        }

        // 6. Filtrar por CUI de Edificio
        if ($cui = $request->input('cui')) {
            $query->whereHas('edificio', function ($q) use ($cui) {
                $q->where('cui', 'like', "%{$cui}%");
            });
        }

        // 7. Filtrar por Nivel Educativo
        $nivel = $request->input('nivel') ?? $request->input('nivel_educativo');
        if (! empty($nivel)) {
            $query->whereHas('modalidades', function ($q) use ($nivel) {
                $q->where('nivel_educativo', 'like', "%{$nivel}%");
            });
        }

        // 8. Filtrar por Ámbito (PUBLICO / PRIVADO)
        if ($ambito = $request->input('ambito')) {
            $query->whereHas('modalidades', function ($q) use ($ambito) {
                $q->where('ambito', 'like', "%{$ambito}%");
            });
        }

        // 9. Filtrar por Sector (1, 2, etc.)
        if ($request->has('sector') && $request->input('sector') !== '') {
            $sector = $request->input('sector');
            $query->whereHas('modalidades', function ($q) use ($sector) {
                $q->where('sector', $sector);
            });
        }

        // 10. Filtrar por Radio
        if ($radio = $request->input('radio')) {
            $query->whereHas('modalidades', function ($q) use ($radio) {
                $q->where('radio', 'like', "%{$radio}%");
            });
        }

        // 11. Filtrar por Categoría
        if ($categoria = $request->input('categoria')) {
            $query->whereHas('modalidades', function ($q) use ($categoria) {
                $q->where('categoria', 'like', "%{$categoria}%");
            });
        }

        // 12. Filtrar solo cabeceras
        if ($request->has('solo_cabeceras') && $request->boolean('solo_cabeceras')) {
            $query->whereColumn('establecimiento_cabecera', 'cue')
                ->orWhereNull('establecimiento_cabecera');
        }

        // Paginación con límite de seguridad (mínimo 1, por defecto 20, máximo 100)
        $perPage = max(1, min((int) $request->input('per_page', 20), 100));

        $establecimientos = $query->orderBy('cue', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return EstablecimientoResource::collection($establecimientos);
    }

    /**
     * Show details for a specific establishment by its CUE (or ID).
     */
    public function show(string $identifier): EstablecimientoResource|JsonResponse
    {
        $establecimiento = Establecimiento::with(['edificio', 'modalidades'])
            ->where('cue', $identifier)
            ->orWhere('id', $identifier)
            ->first();

        if (! $establecimiento) {
            return response()->json([
                'message' => "No se encontró ningún establecimiento con el identificador: {$identifier}",
            ], 404);
        }

        return new EstablecimientoResource($establecimiento);
    }
}
