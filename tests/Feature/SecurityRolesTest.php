<?php

use App\Models\User;

test('administrativos can access dashboard', function () {
    $user = User::factory()->create(['role' => 'administrativos']);

    $response = $this->actingAs($user)->get('/administrativos/Panel');

    $response->assertStatus(200);
});

test('dashboard handles empty and null filter query parameters seamlessly', function () {
    $user = User::factory()->create(['role' => 'administrativos']);

    $response = $this->actingAs($user)->get('/administrativos/Panel?ambito=PRIVADO&departamento=&direccion_area=&nivel_educativo=');

    $response->assertStatus(200);
});
