<?php

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('authenticated user with null password_changed_at is forced to change password', function () {
    $user = User::factory()->create([
        'password_changed_at' => null,
        'role' => 'administrativos',
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/dashboard');

    $response->assertRedirect(route('auth.change-password'));
});

test('user can successfully change mandatory temporary password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('TempPass123!'),
        'password_changed_at' => null,
        'role' => 'administrativos',
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('auth.change-password.store'), [
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

    $response->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->password_changed_at)->not->toBeNull();
    expect(Hash::check('NewSecurePassword123!', $user->password))->toBeTrue();
});

test('audit logs are preserved when user is deleted (nullOnDelete)', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $log = ActivityLog::create([
        'user_id' => $user->id,
        'action' => 'update',
        'model_type' => User::class,
        'model_id' => $user->id,
        'description' => 'Test log description for audit survival',
    ]);

    // Force delete user
    $user->delete();

    $log->refresh();
    expect($log->user_id)->toBeNull();
    expect($log->description)->toBe('Test log description for audit survival');
});

test('admin or staff user cannot self-delete from user profile', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'password_changed_at' => now(),
    ]);

    $response = $this
        ->actingAs($admin)
        ->from('/profile')
        ->delete('/profile', [
            'password' => 'password',
        ]);

    $response->assertRedirect('/profile');
    $response->assertSessionHasErrors('user');
    expect($admin->fresh())->not->toBeNull();
});
