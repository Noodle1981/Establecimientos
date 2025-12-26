<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;
use App\Livewire\Admin\UserManagement;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que el admin puede acceder a la página de gestión de usuarios
     */
    public function test_admin_can_access_user_management(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertStatus(200);
        $response->assertSeeLivewire(UserManagement::class);
    }

    /**
     * Test que los usuarios mid no pueden acceder a gestión de usuarios
     */
    public function test_mid_cannot_access_user_management(): void
    {
        $mid = User::factory()->create(['role' => 'mid']);

        $response = $this->actingAs($mid)->get('/admin/users');
        $response->assertStatus(403);
    }

    /**
     * Test que los usuarios regulares no pueden acceder a gestión de usuarios
     */
    public function test_user_cannot_access_user_management(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin/users');
        $response->assertStatus(403);
    }

    /**
     * Test que el admin puede ver la lista de usuarios
     */
    public function test_admin_can_see_users_list(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $testUser = User::factory()->create(['name' => 'Test User']);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->assertSee('Test User');
    }

    /**
     * Test que el admin puede buscar usuarios
     */
    public function test_admin_can_search_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->set('search', 'John')
            ->assertSee('John Doe')
            ->assertDontSee('Jane Smith');
    }

    /**
     * Test que el admin puede cambiar el rol de un usuario
     */
    public function test_admin_can_change_user_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->call('editRole', $user->id)
            ->set('newRole', 'mid')
            ->call('updateRole');

        $this->assertEquals('mid', $user->fresh()->role);
    }

    /**
     * Test que el admin no puede cambiar su propio rol de admin
     */
    public function test_admin_cannot_change_own_admin_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->call('editRole', $admin->id)
            ->set('newRole', 'user')
            ->call('updateRole');

        $this->assertEquals('admin', $admin->fresh()->role);
    }

    /**
     * Test que el admin puede eliminar usuarios
     */
    public function test_admin_can_delete_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertDatabaseHas('users', ['id' => $user->id]);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->call('confirmDelete', $user->id)
            ->call('deleteUser');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /**
     * Test que el admin no puede eliminarse a sí mismo
     */
    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->assertDatabaseHas('users', ['id' => $admin->id]);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->call('confirmDelete', $admin->id);

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    /**
     * Test que la paginación funciona correctamente
     */
    public function test_pagination_works_correctly(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(15)->create();

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->assertSee('Showing')
            ->assertSee('results');
    }

    /**
     * Test que la validación de rol funciona
     */
    public function test_role_validation_works(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        Livewire::actingAs($admin)
            ->test(UserManagement::class)
            ->call('editRole', $user->id)
            ->set('newRole', 'invalid_role')
            ->call('updateRole')
            ->assertHasErrors(['newRole']);
    }
}
