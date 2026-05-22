<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Este seeder crea usuarios de prueba para cada rol:
     * - admin@example.com (admin)
     * - mid@example.com (mid)
     * - user@example.com (user)
     * 
     * Todos con contraseña: password
     */
    public function run(): void
    {
        // Limpiar tabla de usuarios para empezar de cero
        User::query()->delete();

        // Crear usuario Admin
        User::create([
            'email' => 'Admin@example.com',
            'name' => 'Admin',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Crear usuario Administrativo
        User::create([
            'email' => 'Administrativo@example.com',
            'name' => 'Administrativo',
            'role' => 'administrativos',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Base de datos de usuarios reseteada:');
        $this->command->info('   - Admin@example.com (admin) - password: password');
        $this->command->info('   - Administrativo@example.com (administrativos) - password: password');
    }
}
