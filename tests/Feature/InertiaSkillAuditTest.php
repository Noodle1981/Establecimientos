<?php

use App\Models\User;
use App\Models\Reporte;
use Inertia\Testing\AssertableInertia as Assert;

test('inertia request to non-existent route renders Error component with 404', function () {
    $response = $this->get('/esta-ruta-no-existe-12345', [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(404);
    $response->assertHeader('X-Inertia', 'true');
    $response->assertJson([
        'component' => 'Error',
        'props' => [
            'status' => 404,
        ],
    ]);
});

test('flash messages are properly shared via inertia', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this->actingAs($user)
        ->withSession(['success' => 'Operación completada con éxito'])
        ->get(route('admin.dashboard'));

    $response->assertInertia(fn (Assert $page) => $page
        ->has('flash.success')
        ->where('flash.success', 'Operación completada con éxito')
    );
});

test('administrativo can update reporte status via patch', function () {
    $user = User::factory()->create([
        'role' => 'administrativos',
    ]);

    $reporte = Reporte::create([
        'tipo' => 'error',
        'descripcion' => 'Test de reporte para auditar patch',
        'estado' => 'PENDIENTE',
    ]);

    $response = $this->actingAs($user)
        ->patch(route('administrativos.reportes.update', $reporte->id), [
            'estado' => 'PROCESADO',
        ]);

    $response->assertSessionHas('success');
    expect($reporte->fresh()->estado)->toBe('PROCESADO');
});

test('auditoria index supports partial reload of specific props', function () {
    $user = User::factory()->create([
        'role' => 'administrativos',
    ]);

    $version = hash_file('xxh128', public_path('build/manifest.json'));

    $response = $this->actingAs($user)
        ->get(route('administrativos.auditoria.index'), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Inertia-Partial-Component' => 'Administrativos/Auditoria/Index',
            'X-Inertia-Partial-Data' => 'stats',
        ]);

    $response->assertStatus(200);
    $response->assertHeader('X-Inertia', 'true');
    $json = $response->json();
    expect($json['props'])->toHaveKey('stats');
});

test('establecimientos index returns valid inertia page structure', function () {
    $user = User::factory()->create([
        'role' => 'administrativos',
    ]);

    $response = $this->actingAs($user)
        ->get(route('administrativos.establecimientos.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Administrativos/Establecimientos/Index')
        ->has('modalidades')
        ->has('options')
    );
});
