<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetUserPasswordAction
{
    public function __construct(
        protected ActivityLogService $logger
    ) {}

    /**
     * Resets a user's password to a secure temporary one and forces change on next login.
     *
     * @return string The generated plain temporary password.
     */
    public function execute(User $user): string
    {
        // Generar contraseña aleatoria segura de 12 caracteres (letras y números)
        $tempPass = Str::password(12, letters: true, numbers: true, symbols: false);

        $user->update([
            'password'            => Hash::make($tempPass),
            'password_changed_at' => null, // Fuerza cambio obligatorio en el siguiente login
        ]);

        $this->logger->logUpdate($user, "Blanqueó la contraseña para el usuario {$user->name}", [
            'after' => ['password' => 'TEMPORAL_GENERADA'],
        ]);

        return $tempPass;
    }
}
