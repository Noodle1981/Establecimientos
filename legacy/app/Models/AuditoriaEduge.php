<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditoriaEduge extends Model
{
    use SoftDeletes;

    protected $table = 'auditorias_eduge';

    protected $fillable = [
        'establecimiento_id',
        'user_id',
        'fecha_visita',
        'cambios',
        'observaciones',
        'tipo_cotejo',
        'identificador_eduge',
    ];

    protected $casts = [
        'fecha_visita' => 'date',
        'cambios' => 'json',
    ];

    public function establecimiento(): BelongsTo
    {
        return $this->belongsTo(Establecimiento::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
