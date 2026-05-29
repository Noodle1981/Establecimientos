<?php

use App\Models\User;

test('administrativos can access dashboard', function () {
    $user = User::factory()->create(['role' => 'administrativos']);
    
    $response = $this->actingAs($user)->get('/administrativos/Panel');
    
    $response->assertStatus(200);
});
