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
     * Rutas de Administración (Solo Admin)
     */
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/', AdminDashboard::class)->name('admin.dashboard');
        Route::get('/users', UserManagement::class)->name('admin.users');
        
        // Gestión Compartida bajo prefijo admin
        Route::get('/modalidades', \App\Livewire\Admin\ModalidadesTable::class)->name('admin.modalidades');
        Route::get('/auditorias', \App\Livewire\Admin\AuditoriaEdugeTable::class)->name('admin.auditorias');
        Route::get('/auditorias/nueva', \App\Livewire\Admin\AuditoriaEdugeForm::class)->name('admin.auditorias.create');
        
        // Reportes PDF
        Route::get('/auditorias/{id}/pdf', [\App\Http\Controllers\Admin\PDFController::class, 'downloadIndividual'])->name('admin.auditorias.pdf');
        Route::get('/auditorias/reporte/general', [\App\Http\Controllers\Admin\PDFController::class, 'downloadGeneral'])->name('admin.auditorias.reporte-general');
    });

    /**
     * Rutas Administrativas (Solo Administrativos)
     */
    Route::middleware(['role:administrativos'])->prefix('administrativos')->group(function () {
        Route::get('/Panel', \App\Livewire\Administrativos\AdministrativosDashboard::class)->name('administrativos.dashboard');
        
        // Gestión Compartida bajo prefijo administrativos con nombres propios
        Route::get('/modalidades', \App\Livewire\Admin\ModalidadesTable::class)->name('administrativos.modalidades');
        Route::get('/auditorias', \App\Livewire\Admin\AuditoriaEdugeTable::class)->name('administrativos.auditorias');
        Route::get('/auditorias/nueva', \App\Livewire\Admin\AuditoriaEdugeForm::class)->name('administrativos.auditorias.create');
        
        // Reportes PDF
        Route::get('/auditorias/{id}/pdf', [\App\Http\Controllers\Admin\PDFController::class, 'downloadIndividual'])->name('administrativos.auditorias.pdf');
        Route::get('/auditorias/reporte/general', [\App\Http\Controllers\Admin\PDFController::class, 'downloadGeneral'])->name('administrativos.auditorias.reporte-general');
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
