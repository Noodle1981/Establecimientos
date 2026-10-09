<?php

namespace Database\Seeders;

use App\Models\User;
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
        User::forceCreate([
            'email' => 'oolivera@sanjuan.edu.ar',
            'name' => 'Omar Olivera',
            'role' => 'admin',
            'password' => Hash::make('pass@5000'),
            'email_verified_at' => now(),
            'password_changed_at' => now(),
        ]);

        // Crear usuario Administrativo
        User::forceCreate([
            'email' => 'Administrativo@example.com',
            'name' => 'Administrativo',
            'role' => 'administrativos',
            'password' => Hash::make('pass@5000'),
            'email_verified_at' => now(),
            'password_changed_at' => now(),
        ]);

        // Crear usuario Autoridades
        User::forceCreate([
            'email' => 'Autoridad@example.com',
            'name' => 'Autoridad',
            'role' => 'autoridades',
            'password' => Hash::make('pass@5000'),
            'email_verified_at' => now(),
            'password_changed_at' => now(),
        ]);

        $this->command->info('✅ Base de datos de usuarios reseteada:');
        $this->command->info('   - oolivera@sanjuan.edu.ar (admin) - password: pass@5000');
        $this->command->info('   - Administrativo@example.com (administrativos) - password: pass@5000');
        $this->command->info('   - Autoridad@example.com (autoridades) - password: pass@5000');
    }
}
