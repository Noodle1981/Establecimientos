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
        // Crear usuario Admin
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario Mid
        User::firstOrCreate(
            ['email' => 'mid@example.com'],
            [
                'name' => 'Usuario Mid',
                'role' => 'mid',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario Administrativo
        User::firstOrCreate(
            ['email' => 'administrativo@example.com'],
            [
                'name' => 'Usuario Administrativo',
                'role' => 'administrativos',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario regular
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Usuario Regular',
                'role' => 'user',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Usuarios de prueba creados exitosamente:');
        $this->command->info('   - admin@example.com (admin) - password: password');
        $this->command->info('   - administrativo@example.com (administrativos) - password: password');
        $this->command->info('   - mid@example.com (mid) - password: password');
        $this->command->info('   - user@example.com (user) - password: password');
    }
}
