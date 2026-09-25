<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case ADMINISTRATIVO = 'administrativos';
    case AUTORIDAD = 'autoridades';
    case MID = 'mid';
    case USER = 'user';

    /**
     * Get all values as an array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Roles assignable by an administrator.
     */
    public static function assignableValues(): array
    {
        return [
            self::ADMIN->value,
            self::ADMINISTRATIVO->value,
            self::AUTORIDAD->value,
        ];
    }
}
