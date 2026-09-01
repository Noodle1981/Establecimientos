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

    /**
     * Test que un usuario no autenticado no puede acceder a la bitácora
     */
    public function test_unauthenticated_cannot_access_bitacora(): void
    {
        $response = $this->get(route('bitacora.index'));
        $response->assertRedirect('/login');
    }

    /**
     * Test que un usuario con rol 'user' no puede acceder a la bitácora
     */
    public function test_user_role_cannot_access_bitacora(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('bitacora.index'));
        $response->assertStatus(403);
    }

    /**
     * Test que un usuario con rol 'administrativos' puede acceder a la bitácora
     */
    public function test_administrativo_can_access_bitacora(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);

        $response = $this->actingAs($user)->get(route('bitacora.index'));
        $response->assertStatus(200);
    }

    /**
     * Test que un usuario con rol 'admin' puede acceder a la bitácora
     */
    public function test_admin_can_access_bitacora(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get(route('bitacora.index'));
        $response->assertStatus(200);
    }

    /**
     * Test que autoridades pueden acceder al panel de estadísticas y mapa
     */
    public function test_autoridades_can_access_dashboard_and_map(): void
    {
        $autoridad = User::factory()->create(['role' => 'autoridades']);

        $this->assertTrue($autoridad->isAutoridad());
        $this->assertFalse($autoridad->isAdmin());
        $this->assertFalse($autoridad->isAdministrativo());

        // Redirect from /dashboard to /administrativos/Panel
        $response = $this->actingAs($autoridad)->get('/dashboard');
        $response->assertRedirect(route('administrativos.dashboard'));

        // Access to Panel
        $response = $this->actingAs($autoridad)->get('/administrativos/Panel');
        $response->assertStatus(200);

        // Access to Map
        $response = $this->actingAs($autoridad)->get(route('mapa.publico'));
        $response->assertStatus(200);
    }

    /**
     * Test que autoridades NO pueden acceder a rutas de gestión operativa ni admin
     */
    public function test_autoridades_cannot_access_operational_administrative_routes(): void
    {
        $autoridad = User::factory()->create(['role' => 'autoridades']);

        // Cannot access edificios management
        $this->actingAs($autoridad)->get(route('administrativos.edificios.index'))->assertStatus(403);

        // Cannot access establecimientos management
        $this->actingAs($autoridad)->get(route('administrativos.establecimientos.index'))->assertStatus(403);

        // Cannot access instrumentos
        $this->actingAs($autoridad)->get(route('administrativos.instrumentos.index'))->assertStatus(403);

        // Cannot access auditoria
        $this->actingAs($autoridad)->get(route('administrativos.auditoria.index'))->assertStatus(403);

        // Cannot access reportes
        $this->actingAs($autoridad)->get(route('administrativos.reportes.index'))->assertStatus(403);

        // Cannot access bitacora
        $this->actingAs($autoridad)->get(route('bitacora.index'))->assertStatus(403);

        // Cannot access admin console
        $this->actingAs($autoridad)->get('/admin')->assertStatus(403);
        $this->actingAs($autoridad)->get(route('admin.users.index'))->assertStatus(403);
    }
}
