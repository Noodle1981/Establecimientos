<?php

namespace App\Policies;

use App\Models\Modalidad;
use App\Models\User;

class ModalidadPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'administrativos']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Modalidad $modalidad): bool
    {
        return $user->hasRole(['admin', 'administrativos']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'administrativos']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Modalidad $modalidad): bool
    {
        return $user->hasRole(['admin', 'administrativos']);
    }

    public function delete(User $user, Modalidad $modalidad): bool
    {
        // Soft delete: admin y administrativos para control
        return $user->hasRole(['admin', 'administrativos']);
    }

    /**
     * Determine whether the user can permanently delete the model (hard delete).
     */
    public function forceDelete(User $user, Modalidad $modalidad): bool
    {
        // Hard delete: solo admin
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Modalidad $modalidad): bool
    {
        return $user->hasRole(['admin', 'administrativos']);
    }
}
