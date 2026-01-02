<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Modalidad extends Model
{
    use SoftDeletes;

    protected $table = 'modalidades';

    protected $fillable = [
        'establecimiento_id',
        'direccion_area',
        'nivel_educativo',
        'sector',
        'categoria',
        'inst_legal_categoria',
        'radio',
        'inst_legal_radio',
        'inst_legal_categoria_bis',
        'inst_legal_creacion',
        'ambito',
        'validado',
    ];

    protected $casts = [
        'sector' => 'integer',
        'validado' => 'boolean',
    ];

    public function establecimiento(): BelongsTo
    {
        return $this->belongsTo(Establecimiento::class);
    }

    public function edificio()
    {
        return $this->establecimiento->edificio;
    }

    // Scopes
    public function scopePorNivel($query, $nivel)
    {
        return $query->where('nivel_educativo', $nivel);
    }

    public function scopePorAmbito($query, $ambito)
    {
        return $query->where('ambito', $ambito);
    }

    public function scopeValidados($query)
    {
        return $query->where('validado', true);
    }

    public function scopePendientes($query)
    {
        return $query->where('validado', false);
    }
}
