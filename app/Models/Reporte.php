<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    public function edificio()
    {
        return $this->belongsTo(Edificio::class);
    }
}
