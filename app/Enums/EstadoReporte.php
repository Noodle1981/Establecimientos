<?php

namespace App\Enums;

enum EstadoReporte: string
{
    case PENDIENTE = 'PENDIENTE';
    case PROCESADO = 'PROCESADO';
    case DESCARTADO = 'DESCARTADO';

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
