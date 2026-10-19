<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reporte extends Model
{
    protected $fillable = [
        'edificio_id',
        'tipo',
        'descripcion',
        'nombre_remitente',
        'email_remitente',
        'estado',
    ];

    /**
     * Get the edificio associated with the report.
     */
    public function edificio(): BelongsTo
    {
        return $this->belongsTo(Edificio::class);
    }
}
