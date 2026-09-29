<?php

use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->edificio = Edificio::create([
        'cui' => '7000123',
        'calle' => 'Av. Libertador',
        'numero_puerta' => '1250',
        'localidad' => 'Capital',
        'zona_departamento' => 'Capital',
        'latitud' => -31.5375,
        'longitud' => -68.5364,
    ]);

    $this->establecimiento = Establecimiento::create([
        'edificio_id' => $this->edificio->id,
        'cue' => '700045600',
        'cue_edificio_principal' => '700045600',
        'nombre' => 'Escuela Modelo San Juan',
    ]);

    $this->modalidad = Modalidad::create([
        'establecimiento_id' => $this->establecimiento->id,
        'nivel_educativo' => 'PRIMARIO',
        'direccion_area' => 'PRIMARIA',
        'ambito' => 'PUBLICO',
        'sector' => 1,
        'radio' => 'RADIO 1',
        'categoria' => '1° CATEGORIA',
        'validado' => true,
        'estado_validacion' => 'CORRECTO',
    ]);
});

test('api status endpoint is public and returns service health', function () {
    $response = $this->getJson('/api/v1/status');

    $response->assertOk()
        ->assertJson([
            'status' => 'online',
            'version' => 'v1',
        ]);
});

test('establecimientos index endpoint requires authentication', function () {
    $response = $this->getJson('/api/v1/establecimientos');

    $response->assertUnauthorized();
});

test('authenticated client can list establecimientos with pagination and expected structure', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'cue',
                    'nombre',
                    'es_cabecera',
                    'edificio' => [
                        'id',
                        'cui',
                        'calle',
                        'numero_puerta',
                        'localidad',
                        'departamento',
                        'codigo_postal',
                        'gps' => [
                            'latitud',
                            'longitud',
                        ],
                    ],
                    'modalidades' => [
                        '*' => [
                            'id',
                            'nivel_educativo',
                            'direccion_area',
                            'ambito',
                            'sector',
                            'radio',
                            'categoria',
                            'estado_validacion',
                            'validado',
                        ],
                    ],
                ],
            ],
            'links',
            'meta',
        ]);
});

test('can filter establecimientos by departamento', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos?departamento=Capital');

    $response->assertOk();
    $data = $response->json('data');

    expect($data)->toHaveCount(1);
    expect($data[0]['edificio']['departamento'])->toBe('Capital');
});

test('can filter establecimientos by cue', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos?cue=700045600');

    $response->assertOk();
    $data = $response->json('data');

    expect($data)->toHaveCount(1);
    expect($data[0]['cue'])->toBe('700045600');
});

test('can filter establecimientos by nivel educativo', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos?nivel=PRIMARIO');

    $response->assertOk();
    $data = $response->json('data');

    expect($data)->toHaveCount(1);
    expect($data[0]['modalidades'][0]['nivel_educativo'])->toBe('PRIMARIO');
});

test('can filter establecimientos by ambito', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos?ambito=PUBLICO');

    $response->assertOk();
    $data = $response->json('data');

    expect($data)->toHaveCount(1);
    expect($data[0]['modalidades'][0]['ambito'])->toBe('PUBLICO');
});

test('can retrieve single establecimiento by cue', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos/700045600');

    $response->assertOk()
        ->assertJson([
            'data' => [
                'cue' => '700045600',
                'nombre' => 'Escuela Modelo San Juan',
                'edificio' => [
                    'departamento' => 'Capital',
                    'gps' => [
                        'latitud' => -31.5375,
                        'longitud' => -68.5364,
                    ],
                ],
            ],
        ]);
});

test('returns 404 when establecimiento cue does not exist', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/establecimientos/99999999999');

    $response->assertNotFound();
});
