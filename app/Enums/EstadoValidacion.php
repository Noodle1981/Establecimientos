<?php

namespace App\Enums;

enum EstadoValidacion: string
{
    case PENDIENTE = 'PENDIENTE';
    case CORRECTO = 'CORRECTO';
    case CORREGIDO = 'CORREGIDO';
    case REVISAR = 'REVISAR';
    case BAJA = 'BAJA';

    /**
     * Get array of all values.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
