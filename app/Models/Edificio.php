<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Edificio extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'cui',
        'calle',
        'numero_puerta',
        'orientacion',
        'codigo_postal',
        'localidad',
        'latitud',
        'longitud',
        'letra_zona',
        'zona_departamento',
        'te_voip',
    ];

    protected $casts = [
        'codigo_postal' => 'integer',
        'latitud' => 'decimal:7',
        'longitud' => 'decimal:7',
    ];

    public function establecimientos(): HasMany
    {
        return $this->hasMany(Establecimiento::class);
    }

    public function modalidades(): HasManyThrough
    {
        return $this->hasManyThrough(Modalidad::class, Establecimiento::class);
    }

    // Scope para búsqueda por zona
    public function scopePorZona($query, $zona)
    {
        return $query->where('zona_departamento', $zona);
    }

    // Accessor para coordenadas formateadas
    public function getCoordenadasAttribute(): string
    {
        return "{$this->latitud}, {$this->longitud}";
    }
}
