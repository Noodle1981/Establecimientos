<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Admin\AdminDashboard;
use App\Livewire\Admin\UserManagement;
use App\Livewire\Mid\MidDashboard;
use App\Livewire\User\UserDashboard;
/**
 * Public Routes
 */
Route::redirect('/', '/mapa')->name('home');

/**
 * Authentication Routes
 * Incluye login, register, password reset, etc.
 */
require __DIR__.'/auth.php';

/**
 * Protected Routes (Require Authentication)
 */
Route::middleware(['auth', 'verified', 'password.change'])->group(function () {
    
    /**
     * Dashboard - Redirige según rol
     */
    Route::get('/dashboard', function () {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isAdministrativo()) {
            return redirect()->route('administrativos.dashboard');
        }
        
        return redirect()->route('mapa.publico');
    })->name('dashboard');
    
    /**
     * Ruta de Perfil (Accesible por todos los autenticados)
     */
    Route::view('profile', 'profile')->name('profile');
    
    /**
     * Rutas de Administración (Solo Admin)
     */
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/', AdminDashboard::class)->name('admin.dashboard');
        Route::get('/users', UserManagement::class)->name('admin.users');
        Route::get('/activity-log', \App\Livewire\Admin\ActivityLogTable::class)->name('admin.activity-log');
        
        // Gestión Compartida bajo prefijo admin
        Route::get('/establecimientos', \App\Livewire\Administrativos\ModalidadesTable::class)->name('admin.establecimientos');
        Route::get('/validacion', \App\Livewire\Administrativos\ValidacionModalidadesTable::class)->name('admin.validacion');
        
        // Backward compatibility (redirect old routes)
        Route::get('/modalidades', function() { return redirect()->route('admin.establecimientos'); });
        Route::get('/auditorias', function() { return redirect()->route('admin.validacion'); });
        Route::get('/auditorias/nueva', function() { return redirect()->route('admin.validacion'); });
    });

    /**
     * Rutas Administrativas (Solo Administrativos)
     */
    Route::middleware(['role:administrativos'])->prefix('administrativos')->group(function () {
        Route::get('/Panel', \App\Livewire\Administrativos\AdministrativosDashboard::class)->name('administrativos.dashboard');
        
        // Gestión Compartida bajo prefijo administrativos con nombres propios
        Route::get('/establecimientos', \App\Livewire\Administrativos\ModalidadesTable::class)->name('administrativos.establecimientos');
        Route::get('/instrumentos-legales', \App\Livewire\Administrativos\InstrumentosLegalesTable::class)->name('administrativos.instrumentos-legales');
        Route::get('/validacion', \App\Livewire\Administrativos\ValidacionModalidadesTable::class)->name('administrativos.validacion');
        Route::get('/bitacora', \App\Livewire\Admin\ActivityLogTable::class)->name('administrativos.bitacora');
        
        // Backward compatibility (redirect old routes)
        Route::get('/auditorias', function() { return redirect()->route('administrativos.validacion'); });
        Route::get('/auditorias/nueva', function() { return redirect()->route('administrativos.validacion'); });
    });
});

/**
 * Rutas Públicas del Mapa
 */
Route::get('/mapa', \App\Livewire\Publico\MapaPublico::class)->name('mapa.publico');

/**
 * API Routes
 */
Route::get('/api/edificios-mapa', [\App\Http\Controllers\Api\EdificiosMapaController::class, 'index']);
