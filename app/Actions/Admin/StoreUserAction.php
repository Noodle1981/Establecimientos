<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Hash;

class StoreUserAction
{
    public function __construct(
        protected ActivityLogService $logger
    ) {}

    public function execute(array $data): User
    {
        $user = new User([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->forceFill(['role' => $data['role']])->save();

        $this->logger->logCreate($user, "Creó un nuevo usuario institucional: {$user->name} ({$user->email}) con rol {$user->role}");

        return $user;
    }
}
