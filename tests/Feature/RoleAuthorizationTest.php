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

        // Intentar acceder a ruta administrativa
        $response = $this->get('/administrativos/Panel');
        $response->assertRedirect('/login');

        // Intentar acceder a ruta admin
        $response = $this->get('/admin');
        $response->assertRedirect('/login');
    }

    /**
     * Test que un usuario con rol 'user' es redirigido del dashboard al mapa público
     */
    public function test_user_is_redirected_to_public_map(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertRedirect(route('mapa.publico'));
    }

    /**
     * Test que un usuario con rol 'user' NO puede acceder a rutas administrativas
     */
    public function test_user_cannot_access_administrative_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/administrativos/Panel');
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'user' NO puede acceder a consola admin
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
     * Test que un usuario con rol 'administrativos' puede acceder al panel administrativo
     */
    public function test_administrativo_can_access_administrative_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'administrativos',
        ]);

        $response = $this->actingAs($user)->get('/administrativos/Panel');
        $response->assertStatus(200);
    }

    /**
     * Test que un administrativo es redirigido del dashboard a su panel
     */
    public function test_administrativo_is_redirected_from_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'administrativos',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertRedirect(route('administrativos.dashboard'));
    }

    /**
     * Test que un administrativo NO puede acceder a la consola admin
     */
    public function test_administrativo_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'administrativos',
        ]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'admin' puede acceder a consola admin
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
     * Test que un admin es redirigido del dashboard a su consola
     */
    public function test_admin_is_redirected_from_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertRedirect(route('admin.dashboard'));
    }

    /**
     * Test que un admin puede acceder a rutas de administrativos
     */
    public function test_admin_can_access_administrative_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/administrativos/Panel');
        $response->assertStatus(200);
    }

    /**
     * Test de los métodos helper del modelo User
     */
    public function test_user_role_helper_methods(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $administrativo = User::factory()->create(['role' => 'administrativos']);
        $user = User::factory()->create(['role' => 'user']);

        // Test isAdmin()
        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($administrativo->isAdmin());
        $this->assertFalse($user->isAdmin());

        // Test isAdministrativo()
        $this->assertFalse($admin->isAdministrativo());
        $this->assertTrue($administrativo->isAdministrativo());
        $this->assertFalse($user->isAdministrativo());

        // Test isUser()
        $this->assertFalse($admin->isUser());
        $this->assertFalse($administrativo->isUser());
        $this->assertTrue($user->isUser());

        // Test hasRole()
        $this->assertTrue($admin->hasRole('admin'));
        $this->assertTrue($admin->hasRole(['admin', 'administrativos']));
        $this->assertFalse($user->hasRole(['admin', 'administrativos']));
    }
}
