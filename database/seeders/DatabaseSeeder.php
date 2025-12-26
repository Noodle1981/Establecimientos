<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuarios con roles específicos
        $this->call(RoleUsersSeeder::class);
        
        // Opcional: Crear usuarios adicionales de prueba
        // User::factory(10)->create();
    }
}
