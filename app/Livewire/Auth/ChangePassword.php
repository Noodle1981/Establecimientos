<?php

namespace App\Livewire\Auth;

use Illuminate\Support\Facades\Hash;
use Livewire\Component;

class ChangePassword extends Component
{
    public $current_password = '';
    public $new_password = '';
    public $new_password_confirmation = '';
    public $is_first_login = false;

    public function mount()
    {
        // Check if this is the first login (password never changed)
        $this->is_first_login = is_null(auth()->user()->password_changed_at);
    }

    public function updatePassword()
    {
        $rules = [
            'new_password' => 'required|string|min:8|confirmed',
        ];

        // Only require current password if it's not the first login
        if (!$this->is_first_login) {
            $rules['current_password'] = 'required|current_password';
        }

        $this->validate($rules, [
            'current_password.current_password' => 'La contraseña actual no es correcta.',
            'new_password.required' => 'La nueva contraseña es obligatoria.',
            'new_password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'new_password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        $user = auth()->user();

        // Update password and mark as changed
        $user->update([
            'password' => Hash::make($this->new_password),
            'password_changed_at' => now(),
        ]);

        // Log the password change
        app(\App\Services\ActivityLogService::class)->logUpdate(
            $user,
            "Cambió su contraseña",
            null
        );

        $this->dispatch('notify', type: 'success', message: 'Contraseña actualizada correctamente.');

        // Redirect to dashboard
        return redirect()->route('dashboard');
    }

    public function render()
    {
        return view('livewire.auth.change-password')->layout('layouts.guest');
    }
}
