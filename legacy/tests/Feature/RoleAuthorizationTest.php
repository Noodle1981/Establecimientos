<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que un usuario no autenticado no puede acceder a rutas protegidas
     */
    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        // Intentar acceder al dashboard sin autenticación
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');

        // Intentar acceder a ruta mid
        $response = $this->get('/mid');
        $response->assertRedirect('/login');

        // Intentar acceder a ruta admin
        $response = $this->get('/admin');
        $response->assertRedirect('/login');
    }

    /**
     * Test que un usuario con rol 'user' puede acceder a /dashboard
     */
    public function test_user_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'user' NO puede acceder a /mid
     */
    public function test_user_cannot_access_mid_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/mid');
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'user' NO puede acceder a /admin
     */
    public function test_user_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'mid' puede acceder a /mid
     */
    public function test_mid_can_access_mid_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'mid',
        ]);

        $response = $this->actingAs($user)->get('/mid');
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'mid' puede acceder a /dashboard
     */
    public function test_mid_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'mid',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'mid' NO puede acceder a /admin
     */
    public function test_mid_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'mid',
        ]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'admin' puede acceder a /admin
     */
    public function test_admin_can_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'admin' puede acceder a /mid
     */
    public function test_admin_can_access_mid_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/mid');
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'admin' puede acceder a /dashboard
     */
    public function test_admin_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test de los métodos helper del modelo User
     */
    public function test_user_role_helper_methods(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $mid = User::factory()->create(['role' => 'mid']);
        $user = User::factory()->create(['role' => 'user']);

        // Test isAdmin()
        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($mid->isAdmin());
        $this->assertFalse($user->isAdmin());

        // Test isMid()
        $this->assertFalse($admin->isMid());
        $this->assertTrue($mid->isMid());
        $this->assertFalse($user->isMid());

        // Test isUser()
        $this->assertFalse($admin->isUser());
        $this->assertFalse($mid->isUser());
        $this->assertTrue($user->isUser());

        // Test hasRole()
        $this->assertTrue($admin->hasRole('admin'));
        $this->assertTrue($admin->hasRole(['admin', 'mid']));
        $this->assertFalse($user->hasRole(['admin', 'mid']));
    }
}
