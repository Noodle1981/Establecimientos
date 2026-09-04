<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\Modalidad;
use App\Models\Edificio;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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

    public function storeUser(Request $request, ActivityLogService $logger)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,administrativos,autoridades',
        ]);

        $user = new User([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $user->forceFill(['role' => $validated['role']])->save();

        $logger->logCreate($user, "Creó un nuevo usuario: {$user->name}");

        return back()->with('success', 'Usuario creado correctamente.');
    }

    public function resetPassword(Request $request, $id, ActivityLogService $logger)
    {
        $user = User::findOrFail($id);

        // Generar contraseña aleatoria segura de 12 caracteres
        $tempPass = Str::password(12, letters: true, numbers: true, symbols: false);
        
        $user->update([
            'password'            => Hash::make($tempPass),
            'password_changed_at' => null, // Force reset on login
        ]);

        $logger->logUpdate($user, "Blanqueó la contraseña", ['after' => ['password' => 'TEMPORAL_GENERADA']]);

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
            ->paginate(20);

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs
        ]);
    }

    /**
     * Trash Management
     */
    public function trash(Request $request): Response
    {
        $modalidades = Modalidad::onlyTrashed()->with(['establecimiento' => fn($q) => $q->withTrashed()])->get();
        $edificios = Edificio::onlyTrashed()->get();

        return Inertia::render('Admin/Trash/Index', [
            'modalidades' => $modalidades,
            'edificios' => $edificios
        ]);
    }

    public function restore($type, $id)
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($type, $id) {
            $model = $type === 'modalidad' ? Modalidad::onlyTrashed() : Edificio::onlyTrashed();
            $record = $model->findOrFail($id);
            $record->restore();

            // Restauración inversa en cascada
            if ($type === 'modalidad') {
                $est = $record->establecimiento()->onlyTrashed()->first();
                if ($est) {
                    $est->restore();
                }
            }
        });

        return back()->with('success', 'Registro recuperado.');
    }

    public function forceDelete($id, ActivityLogService $logger)
    {
        $mod = Modalidad::withTrashed()->with([
            'establecimiento' => function($q) { $q->withTrashed(); },
            'establecimiento.modalidades' => function($q) { $q->withTrashed(); }
        ])->findOrFail($id);
        
        $est = $mod->establecimiento;

        $name = $est->nombre;
        $cue = $est->cue;

        // Force delete all modalities of this establishment
        foreach ($est->modalidades()->withTrashed()->get() as $m) {
            $m->forceDelete();
        }

        $est->forceDelete();

        $logger->logDelete($mod, "BORRADO PERMANENTE: {$name} (CUE: {$cue}). CUE liberado.");

        return back()->with('success', 'Establecimiento y datos asociados eliminados permanentemente.');
    }
}
