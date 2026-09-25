<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ChangePasswordController extends Controller
{
    /**
     * Show the mandatory password change form.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ChangePassword');
    }

    /**
     * Update the temporary password with a new user-chosen password.
     */
    public function store(ChangePasswordRequest $request, ActivityLogService $logger): RedirectResponse
    {
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
            'password_changed_at' => now(),
        ]);

        $logger->logUpdate($user, "Actualizó su contraseña obligatoria de primer ingreso");

        return redirect()->route('dashboard')->with('success', 'Contraseña actualizada correctamente. ¡Bienvenido al sistema!');
    }
}
