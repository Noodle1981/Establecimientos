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
        'observaciones',
    ];

    protected $casts = [
        // 'cue' and 'cue_edificio_principal' left as strings to preserve leading zeros
    ];

    protected static function booted()
    {
        static::updating(function ($establecimiento) {
            if ($establecimiento->isDirty('cue')) {
                $oldCue = $establecimiento->getOriginal('cue');
                $newCue = $establecimiento->cue;

                // Propagar en cascada para evitar enlaces rotos de cabecera
                static::where('establecimiento_cabecera', $oldCue)
                    ->update(['establecimiento_cabecera' => $newCue]);
            }
        });
    }

    public function edificio(): BelongsTo
    {
        return $this->belongsTo(Edificio::class);
    }

    public function modalidades(): HasMany
    {
        return $this->hasMany(Modalidad::class);
    }

    /**
     * Relación con el establecimiento cabecera (usando CUE)
     */
    public function cabecera(): BelongsTo
    {
        return $this->belongsTo(Establecimiento::class, 'establecimiento_cabecera', 'cue');
    }

    public function auditorias(): HasMany
    {
        return $this->hasMany(AuditoriaEduge::class);
    }

    // Scope para búsqueda
    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombre', 'like', "%{$nombre}%");
    }
}
