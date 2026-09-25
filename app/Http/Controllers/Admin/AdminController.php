<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\ForceDeleteModalidadAction;
use App\Actions\Admin\ResetUserPasswordAction;
use App\Actions\Admin\RestoreTrashAction;
use App\Actions\Admin\StoreUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Models\ActivityLog;
use App\Models\Edificio;
use App\Models\Modalidad;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * User Management
     */
    public function users(Request $request): Response
    {
        $users = User::query()
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Store a newly created institutional user.
     */
    public function storeUser(StoreUserRequest $request, StoreUserAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return back()->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Reset user password to a temporary generated one.
     */
    public function resetPassword(int|string $id, ResetUserPasswordAction $action): RedirectResponse
    {
        $user = User::findOrFail($id);

        $tempPass = $action->execute($user);

        return back()->with('success', "Contraseña temporal generada: {$tempPass}");
    }

    /**
     * Activity Logs
     */
    public function logs(Request $request): Response
    {
        $logs = ActivityLog::with('user')
            ->when($request->search, function ($q, $search) {
                $q->where('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs
        ]);
    }

    /**
     * Trash Management
     */
    public function trash(): Response
    {
        $modalidades = Modalidad::onlyTrashed()->with(['establecimiento' => fn($q) => $q->withTrashed()])->get();
        $edificios = Edificio::onlyTrashed()->get();

        return Inertia::render('Admin/Trash/Index', [
            'modalidades' => $modalidades,
            'edificios' => $edificios
        ]);
    }

    /**
     * Restore record from trash.
     */
    public function restore(string $type, int|string $id, RestoreTrashAction $action): RedirectResponse
    {
        $action->execute($type, $id);

        return back()->with('success', 'Registro recuperado.');
    }

    /**
     * Permanently delete establishment and associated modalities.
     */
    public function forceDelete(int|string $id, ForceDeleteModalidadAction $action): RedirectResponse
    {
        $action->execute($id);

        return back()->with('success', 'Establecimiento y datos asociados eliminados permanentemente.');
    }
}
