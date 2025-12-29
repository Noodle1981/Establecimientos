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
Route::view('/', 'welcome')->name('home');
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
     * Dashboard de Usuario (Accesible por todos los roles autenticados)
     * Los usuarios con rol 'user', 'mid' y 'admin' pueden acceder
     */
    Route::get('/dashboard', UserDashboard::class)->name('dashboard');
    
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
     * Rutas Admin (Solo accesible por rol 'admin')
     */
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin', AdminDashboard::class)->name('admin.dashboard');
        Route::get('/admin/users', UserManagement::class)->name('admin.users');
        Route::get('/admin/modalidades', \App\Livewire\Admin\ModalidadesTable::class)->name('admin.modalidades');
    });
    
    /**
     * Rutas Administrativos (Accesible por 'admin' y 'administrativos')
     */
    Route::middleware(['role:admin,administrativos'])->group(function () {
        Route::get('/administrativos/modalidades', \App\Livewire\Admin\ModalidadesTable::class)->name('administrativos.modalidades');
    });
});
