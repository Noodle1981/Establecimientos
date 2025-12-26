<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Admin\AdminDashboard;
use App\Livewire\Admin\UserManagement;
use App\Livewire\Mid\MidDashboard;
use App\Livewire\User\UserDashboard;

/**
 * Public Routes
 */
Route::view('/', 'welcome')->name('home');

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
    });
});
