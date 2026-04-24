<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditoriaReconciliationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $edificio;
    protected $mod1;
    protected $mod2;
    protected $modOther;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['role' => 'administrativos']);
        
        $this->edificio = Edificio::create([
            'cui' => 12345,
            'calle' => 'Calle Falsa',
            'numero_puerta' => '123',
            'localidad' => 'SANTA LUCIA',
            'latitud' => -31.0,
            'longitud' => -68.0,
            'zona_departamento' => 'SANTA LUCIA'
        ]);
        
        $est1 = Establecimiento::create([
            'edificio_id' => $this->edificio->id,
            'cue' => 700000000,
            'cue_edificio_principal' => 700000000,
            'nombre' => 'Escuela 1'
        ]);
        $this->mod1 = Modalidad::create([
            'establecimiento_id' => $est1->id, 
            'estado_validacion' => 'PENDIENTE',
            'direccion_area' => 'PRIMARIA',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'PUBLICO'
        ]);
        
        $est2 = Establecimiento::create([
            'edificio_id' => $this->edificio->id,
            'cue' => 700000100,
            'cue_edificio_principal' => 700000000,
            'nombre' => 'Escuela 2'
        ]);
        $this->mod2 = Modalidad::create([
            'establecimiento_id' => $est2->id, 
            'estado_validacion' => 'PENDIENTE',
            'direccion_area' => 'SECUNDARIA',
            'nivel_educativo' => 'SECUNDARIA',
            'ambito' => 'PUBLICO'
        ]);
        
        $edificioOther = Edificio::create([
            'cui' => 54321,
            'calle' => 'Otra Calle',
            'localidad' => 'CAPITAL',
            'latitud' => -31.1,
            'longitud' => -68.1,
            'zona_departamento' => 'CAPITAL'
        ]);
        $estOther = Establecimiento::create([
            'edificio_id' => $edificioOther->id,
            'cue' => 800000000,
            'cue_edificio_principal' => 800000000,
            'nombre' => 'Escuela Otras'
        ]);
        $this->modOther = Modalidad::create([
            'establecimiento_id' => $estOther->id, 
            'estado_validacion' => 'PENDIENTE',
            'direccion_area' => 'INICIAL',
            'nivel_educativo' => 'INICIAL',
            'ambito' => 'PUBLICO'
        ]);
    }

    public function test_can_fetch_linked_modalities()
    {
        $response = $this->actingAs($this->user)
            ->get(route('administrativos.auditoria.vinculados', $this->mod1->id));

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['id' => $this->mod2->id]);
    }

    public function test_can_propagate_validation_to_building()
    {
        $payload = [
            'estado' => 'CORRECTO',
            'observaciones' => 'Test propagation',
            'campos_auditados' => ['CUI', 'GPS'],
            'propagar_al_edificio' => true
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('administrativos.auditoria.updateEstado', $this->mod1->id), $payload);

        $response->assertRedirect();
        
        $this->mod1->refresh();
        $this->assertEquals('CORRECTO', $this->mod1->estado_validacion);

        $this->mod2->refresh();
        $this->assertEquals('CORRECTO', $this->mod2->estado_validacion);
        $this->assertNull($this->mod2->observaciones, 'La observación NO debería copiarse, debería mantenerse la original (nula en este caso)');
        $this->assertContains('CUI', $this->mod2->campos_auditados);

        $this->modOther->refresh();
        $this->assertEquals('PENDIENTE', $this->modOther->estado_validacion);
    }

    public function test_does_not_propagate_if_flag_is_false()
    {
        $payload = [
            'estado' => 'CORRECTO',
            'observaciones' => 'No propagation',
            'campos_auditados' => ['CUI'],
            'propagar_al_edificio' => false
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('administrativos.auditoria.updateEstado', $this->mod1->id), $payload);

        $this->mod1->refresh();
        $this->assertEquals('CORRECTO', $this->mod1->estado_validacion);

        $this->mod2->refresh();
        $this->assertEquals('PENDIENTE', $this->mod2->estado_validacion);
    }

    public function test_propagation_is_granular_only_shared_fields()
    {
        // mod2 ya tiene 'RADIO' tildado
        $this->mod2->campos_auditados = ['RADIO'];
        $this->mod2->save();

        $payload = [
            'estado' => 'CORRECTO',
            'observaciones' => 'Propagación granular',
            'campos_auditados' => ['Nombre', 'CUI', 'GPS'], // Nombre es específico, CUI/GPS son compartidos
            'propagar_al_edificio' => true
        ];

        $this->actingAs($this->user)
            ->patch(route('administrativos.auditoria.updateEstado', $this->mod1->id), $payload);

        $this->mod1->refresh();
        $this->assertContains('Nombre', $this->mod1->campos_auditados);
        $this->assertContains('CUI', $this->mod1->campos_auditados);

        $this->mod2->refresh();
        $this->assertNotContains('Nombre', $this->mod2->campos_auditados, 'No debería copiar campos específicos como Nombre');
        $this->assertContains('CUI', $this->mod2->campos_auditados, 'Debería copiar campos compartidos como CUI');
        $this->assertContains('GPS', $this->mod2->campos_auditados, 'Debería copiar campos compartidos como GPS');
        $this->assertContains('RADIO', $this->mod2->campos_auditados, 'Debería MANTENER los campos específicos que ya tenía como RADIO');
    }

    public function test_propagation_preserves_sibling_observations()
    {
        // mod2 tiene una observación específica
        $this->mod2->observaciones = 'Nota específica de la escuela 2';
        $this->mod2->save();

        $payload = [
            'estado' => 'CORRECTO',
            'observaciones' => 'Actualización global del edificio',
            'campos_auditados' => ['CUI'],
            'propagar_al_edificio' => true
        ];

        $this->actingAs($this->user)
            ->patch(route('administrativos.auditoria.updateEstado', $this->mod1->id), $payload);

        $this->mod1->refresh();
        $this->assertEquals('Actualización global del edificio', $this->mod1->observaciones);

        $this->mod2->refresh();
        $this->assertEquals('CORRECTO', $this->mod2->estado_validacion, 'El estado debería compartirse');
        $this->assertEquals('Nota específica de la escuela 2', $this->mod2->observaciones, 'La observación debería PRESERVARSE');
    }
}
