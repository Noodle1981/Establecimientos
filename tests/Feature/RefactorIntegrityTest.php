<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Edificio;
use App\Models\Modalidad;
use App\Models\Establecimiento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RefactorIntegrityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Public Map
     */
    public function test_public_map_is_accessible(): void
    {
        $response = $this->get('/mapa');
        $response->assertStatus(200);
    }

    /**
     * Test Public Report Submission
     */
    public function test_public_can_submit_report(): void
    {
        $response = $this->post('/reportes', [
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'Descripción de prueba para reporte',
            'email_remitente' => 'test@example.com'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reportes', [
            'tipo' => 'ERROR_DATOS',
            'email_remitente' => 'test@example.com'
        ]);
    }

    /**
     * Test Administrative Access to Refactored Controllers
     */
    public function test_administrativo_can_access_modalidades(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/establecimientos');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_edificios(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/edificios');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_auditoria(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/auditoria');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_reportes_inbox(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/reportes');
        $response->assertStatus(200);
    }

    /**
     * Test Creation through Action (SRP check)
     */
    public function test_can_create_modalidad_structure(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->post('/administrativos/establecimientos', [
            'cui' => '1234567',
            'cue' => '123456789',
            'nombre_establecimiento' => 'Escuela de Prueba',
            'establecimiento_cabecera' => 'CABECERA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'direccion_area' => 'AREA TEST',
            'ambito' => 'URBANO',
            'calle' => 'Calle Falsa 123',
            'localidad' => 'SAN JUAN',
            'zona_departamento' => 'CAPITAL',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('edificios', ['cui' => '1234567']);
        $this->assertDatabaseHas('establecimientos', ['cue' => '123456789']);
        $this->assertDatabaseHas('modalidades', ['nivel_educativo' => 'PRIMARIA']);
    }
}
