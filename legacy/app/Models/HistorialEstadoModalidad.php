<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialEstadoModalidad extends Model
{
    protected $table = 'historial_estados_modalidad';

    protected $fillable = [
        'modalidad_id',
        'user_id',
        'estado_anterior',
        'estado_nuevo',
        'observaciones',
    ];

    /**
     * Relación con Modalidad
     */
    public function modalidad(): BelongsTo
    {
        return $this->belongsTo(Modalidad::class);
    }

    /**
     * Relación con User (quien hizo el cambio)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
