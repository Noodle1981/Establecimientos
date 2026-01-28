<?php

namespace App\Livewire\Admin;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Hash;

class UserManagement extends Component
{
    use WithPagination;


    public $search = '';
    public $selectedUser = null;
    public $newRole = '';
    public $showDeleteModal = false;
    public $userToDelete = null;

    // Create user properties
    public $showCreateModal = false;
    public $newUserName = '';
    public $newUserEmail = '';
    public $newUserPassword = '';
    public $newUserPasswordConfirmation = '';
    public $newUserRole = 'administrativos';

    protected $queryString = ['search'];

    public function updatedSearch()
    {
        $this->resetPage();
    }

    // Modal Create
    public function openCreateModal()
    {
        $this->resetCreateForm();
        $this->showCreateModal = true;
    }

    public function closeCreateModal()
    {
        $this->showCreateModal = false;
        $this->resetCreateForm();
    }

    public function resetCreateForm()
    {
        $this->newUserName = '';
        $this->newUserEmail = '';
        $this->newUserPassword = '';
        $this->newUserPasswordConfirmation = '';
        $this->newUserRole = 'administrativos';
        $this->resetErrorBag();
    }

    public function createUser()
    {
        $this->validate([
            'newUserName' => 'required|string|min:3',
            'newUserEmail' => 'required|email|unique:users,email',
            'newUserPassword' => 'required|string|min:8|confirmed:newUserPassword',
            'newUserRole' => 'required|in:admin,administrativos',
        ], [
            'newUserPassword.confirmed' => 'Las contraseñas no coinciden.',
            'newUserPassword.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'newUserRole.in' => 'El rol seleccionado no es válido.'
        ]);

        $user = User::create([
            'name' => $this->newUserName,
            'email' => $this->newUserEmail,
            'password' => Hash::make($this->newUserPassword),
            'role' => $this->newUserRole,
            'password_changed_at' => null, // Force password change on first login
        ]);

        // Log the creation
        app(\App\Services\ActivityLogService::class)->logCreate($user, "Creó un nuevo usuario: {$user->name} con rol {$user->role}");

        $this->dispatch('notify', type: 'success', message: 'Usuario creado correctamente.');
        $this->closeCreateModal();
    }

    public function editRole($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            $this->dispatch('notify', type: 'error', message: 'Usuario no encontrado.');
            return;
        }

        $this->selectedUser = $user;
        $this->newRole = $user->role;
    }

    public function updateRole()
    {
        $this->validate([
            'newRole' => 'required|in:admin,administrativos',
        ]);

        if (!$this->selectedUser) {
            $this->dispatch('notify', type: 'error', message: 'Usuario no seleccionado.');
            return;
        }

        // No permitir que el admin se quite su propio rol admin
        if ($this->selectedUser->id === auth()->id() && $this->newRole !== 'admin') {
            $this->dispatch('notify', type: 'error', message: 'No puedes cambiar tu propio rol de admin.');
            $this->cancelEdit();
            return;
        }

        $oldRole = $this->selectedUser->role;
        $this->selectedUser->update(['role' => $this->newRole]);

        // Log the update
        app(\App\Services\ActivityLogService::class)->logUpdate(
            $this->selectedUser, 
            "Actualizó el rol del usuario {$this->selectedUser->name}",
            ['role' => ['before' => $oldRole, 'after' => $this->newRole]]
        );

        $this->dispatch('notify', type: 'success', message: 'Rol actualizado correctamente.');
        $this->cancelEdit();
    }

    public function cancelEdit()
    {
        $this->selectedUser = null;
        $this->newRole = '';
    }

    public function confirmDelete($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            $this->dispatch('notify', type: 'error', message: 'Usuario no encontrado.');
            return;
        }

        // No permitir que el admin se elimine a sí mismo
        if ($user->id === auth()->id()) {
            $this->dispatch('notify', type: 'error', message: 'No puedes eliminarte a ti mismo.');
            return;
        }

        $this->userToDelete = $user;
        $this->showDeleteModal = true;
    }

    public function deleteUser()
    {
        if (!$this->userToDelete) {
            return;
        }

        // Log the deletion
        app(\App\Services\ActivityLogService::class)->logDelete($this->userToDelete, "Eliminó al usuario: {$this->userToDelete->name}");

        $this->userToDelete->delete();

        $this->dispatch('notify', type: 'success', message: 'Usuario eliminado correctamente.');
        
        $this->showDeleteModal = false;
        $this->userToDelete = null;
    }

    public function cancelDelete()
    {
        $this->showDeleteModal = false;
        $this->userToDelete = null;
    }

    public function render()
    {
        $users = User::query()
            ->when($this->search, function ($query) {
                $query->where('name', 'like', '%' . $this->search . '%')
                      ->orWhere('email', 'like', '%' . $this->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('livewire.admin.user-management', [
            'users' => $users,
        ]);
    }
}
