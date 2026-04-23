<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reporte;
use App\Models\Edificio;

class ReporteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $edificios = Edificio::all();

        Reporte::create([
            'edificio_id' => $edificios->where('cui', 7000001)->first()?->id,
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'La dirección que figura en el mapa no es la correcta. La entrada principal es por la calle lateral.',
            'nombre_remitente' => 'Juan Pérez',
            'email_remitente' => 'juan.perez@example.com',
            'estado' => 'PENDIENTE',
        ]);

        Reporte::create([
            'edificio_id' => $edificios->where('cui', 7000003)->first()?->id,
            'tipo' => 'UBICACION_INCORRECTA',
            'descripcion' => 'El marcador en el mapa está desplazado unos 50 metros hacia el norte.',
            'nombre_remitente' => 'María García',
            'email_remitente' => 'mgarcia@example.com',
            'estado' => 'PENDIENTE',
        ]);

        Reporte::create([
            'edificio_id' => null,
            'tipo' => 'SUGERENCIA',
            'descripcion' => 'Sería genial que el mapa mostrara qué escuelas tienen rampa para discapacitados.',
            'nombre_remitente' => 'Ramiro López',
            'estado' => 'PROCESADO',
        ]);

        Reporte::create([
            'edificio_id' => $edificios->where('cui', 7000006)->first()?->id,
            'tipo' => 'INFO_FALTANTE',
            'descripcion' => 'Falta cargar el turno noche en este establecimiento.',
            'nombre_remitente' => 'Laura Torres',
            'email_remitente' => 'laura@escuelas.com',
            'estado' => 'PENDIENTE',
        ]);
    }
}
