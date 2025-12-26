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

    protected $queryString = ['search'];

    public function updatedSearch()
    {
        $this->resetPage();
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
            'newRole' => 'required|in:admin,mid,user',
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

        $this->selectedUser->update(['role' => $this->newRole]);

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
