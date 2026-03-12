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
        'zona',
        'observaciones',
        'categoria',
        'inst_legal_categoria',
        'radio',
        'inst_legal_radio',
        'inst_legal_categoria_bis',
        'inst_legal_creacion',
        'ambito',
        'validado',
        'estado_validacion',
        'validado_por_user_id',
        'validado_en',
    ];

    protected $casts = [
        'sector' => 'integer',
        'validado' => 'boolean',
        'validado_en' => 'datetime',
    ];

    public function establecimiento(): BelongsTo
    {
        return $this->belongsTo(Establecimiento::class);
    }

    public function edificio()
    {
        return $this->establecimiento->edificio;
    }

    /**
     * Relación con el usuario que validó
     */
    public function usuarioValidacion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validado_por_user_id');
    }

    /**
     * Relación con el historial de estados
     */
    public function historialEstados()
    {
        return $this->hasMany(HistorialEstadoModalidad::class);
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

    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado_validacion', $estado);
    }

    public function scopeExcluyendoEliminados($query)
    {
        return $query->where('estado_validacion', '!=', 'ELIMINADO');
    }

    /**
     * Cambiar estado de validación y registrar en historial
     */
    public function cambiarEstado(string $nuevoEstado, ?string $observaciones = null, ?int $userId = null)
    {
        $estadoAnterior = $this->estado_validacion;
        
        // Actualizar estado
        $this->estado_validacion = $nuevoEstado;
        $this->validado = true; // Asegurar que pase a ser considerado validado
        $this->validado_por_user_id = $userId ?? auth()->id();
        $this->validado_en = now();
        $this->save();
        
        // Registrar en historial
        $this->historialEstados()->create([
            'user_id' => $userId ?? auth()->id(),
            'estado_anterior' => $estadoAnterior,
            'estado_nuevo' => $nuevoEstado,
            'observaciones' => $observaciones,
        ]);
        
        return $this;
    }
}
