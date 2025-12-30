<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Admin\AdminDashboard;
use App\Livewire\Admin\UserManagement;
use App\Livewire\Mid\MidDashboard;
use App\Livewire\User\UserDashboard;
use App\Http\Controllers\SetupController;

/**
 * Public Routes
 */
Route::redirect('/', '/mapa')->name('home');
Route::get('/setup', [SetupController::class, 'index'])->name('setup.index');
Route::post('/setup', [SetupController::class, 'store'])->name('setup.store');

/**
 * Authentication Routes
 * Incluye login, register, password reset, etc.
 */
require __DIR__.'/auth.php';

/**
 * Protected Routes (Require Authentication)
 */
Route::middleware(['auth', 'verified'])->group(function () {
    
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
     * Rutas Mid (Accesible por roles 'mid' y 'admin')
     */
    Route::middleware(['role:mid,admin'])->group(function () {
        Route::get('/mid', MidDashboard::class)->name('mid.dashboard');
    });
    
    /**
     * Rutas de Gestión (Admin y Administrativos)
     */
    Route::middleware(['role:admin,administrativos'])->group(function () {
        Route::get('/admin', AdminDashboard::class)->name('admin.dashboard');
        Route::get('/admin/users', UserManagement::class)->name('admin.users');
        Route::get('/admin/modalidades', \App\Livewire\Admin\ModalidadesTable::class)->name('admin.modalidades');
        
        // Auditorías EDUGE
        Route::get('/auditorias', \App\Livewire\Admin\AuditoriaEdugeTable::class)->name('admin.auditorias');
        Route::get('/auditorias/nueva', \App\Livewire\Admin\AuditoriaEdugeForm::class)->name('admin.auditorias.create');
        
        // Reportes PDF
        Route::get('/auditorias/{id}/pdf', [\App\Http\Controllers\Admin\PDFController::class, 'downloadIndividual'])->name('admin.auditorias.pdf');
        Route::get('/auditorias/reporte/general', [\App\Http\Controllers\Admin\PDFController::class, 'downloadGeneral'])->name('admin.auditorias.reporte-general');
        
        // Redirección para retrocompatibilidad
        Route::get('/administrativos', function() { return redirect()->route('admin.dashboard'); })->name('administrativos.dashboard');
        Route::get('/administrativos/modalidades', function() { return redirect()->route('admin.modalidades'); })->name('administrativos.modalidades');
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
