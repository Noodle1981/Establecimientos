<?php

use App\Models\User;

// Mostrar todos los usuarios
echo "=== USUARIOS EXISTENTES ===\n\n";

$users = User::all();

foreach ($users as $user) {
    echo "Email: {$user->email}\n";
    echo "Nombre: {$user->name}\n";
    echo "Rol: {$user->role}\n";
    echo "Contraseña: password\n";
    echo "---\n";
}

echo "\nTotal: " . $users->count() . " usuarios\n";
