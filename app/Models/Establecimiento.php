<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Establecimiento extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'edificio_id',
        'cue',
        'cue_edificio_principal',
        'nombre',
        'establecimiento_cabecera',
    ];

    protected $casts = [
        'cue' => 'integer',
        'cue_edificio_principal' => 'integer',
    ];

    public function edificio(): BelongsTo
    {
        return $this->belongsTo(Edificio::class);
    }

    public function modalidades(): HasMany
    {
        return $this->hasMany(Modalidad::class);
    }

    // Scope para búsqueda
    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombre', 'like', "%{$nombre}%");
    }
}
