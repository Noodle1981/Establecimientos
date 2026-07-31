<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditoriaExcelExportTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $mod;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['role' => 'administrativos']);

        $edificio = Edificio::create([
            'cui' => 99999,
            'calle' => 'Avenida Central',
            'numero_puerta' => '456',
            'localidad' => 'CAPITAL',
            'latitud' => -31.53,
            'longitud' => -68.52,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => 700099999,
            'cue_edificio_principal' => 700099999,
            'nombre' => 'Escuela de Prueba Excel'
        ]);

        $this->mod = Modalidad::create([
            'establecimiento_id' => $est->id,
            'estado_validacion' => 'PENDIENTE',
            'direccion_area' => 'PRIMARIA',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'PUBLICO'
        ]);
    }

    public function test_authenticated_user_can_export_auditoria_excel()
    {
        $response = $this->actingAs($this->user)
            ->get(route('administrativos.auditoria.exportExcel'));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_authenticated_user_can_export_auditoria_pdf()
    {
        $response = $this->actingAs($this->user)
            ->get(route('administrativos.auditoria.exportPdf'));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }
}
