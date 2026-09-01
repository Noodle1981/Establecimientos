<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Public Routes
 */
Route::redirect('/', '/mapa')->name('home');

Route::get('/mapa', [App\Http\Controllers\Publico\MapaController::class, 'index'])->name('mapa.publico');
Route::post('/reportes', [App\Http\Controllers\Publico\ReporteController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('publico.reportes.store');

/**
 * Authentication Routes
 */
require __DIR__.'/auth.php';

/**
 * Protected Routes (Require Authentication)
 */
Route::middleware(['auth'])->group(function () {
    
    /**
     * Dashboard - Redirige según rol
     */
    Route::get('/dashboard', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if ($user?->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user?->isAdministrativo() || $user?->isAutoridad()) {
            return redirect()->route('administrativos.dashboard');
        }
        
        return redirect()->route('mapa.publico');
    })->name('dashboard');

    /**
     * Rutas de Perfil (Inertia)
     */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /**
     * Rutas de Administración (Inertia)
     */
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
    });

    /**
     * Panel de Estadísticas / Métricas (Accesible por Admin, Administrativos y Autoridades)
     */
    Route::middleware(['role:admin,administrativos,autoridades'])->prefix('administrativos')->group(function () {
        Route::get('/Panel', [App\Http\Controllers\Administrativos\DashboardController::class, 'index'])->name('administrativos.dashboard');
    });

    /**
     * Rutas Operativas de Gestión Administrativa (Admin y Administrativos)
     */
    Route::middleware(['role:admin,administrativos'])->prefix('administrativos')->group(function () {
        
        // Gestión de Edificios
        Route::get('/edificios', [App\Http\Controllers\Administrativos\EdificioController::class, 'index'])->name('administrativos.edificios.index');
        Route::post('/edificios', [App\Http\Controllers\Administrativos\EdificioController::class, 'store'])->name('administrativos.edificios.store');
        Route::patch('/edificios/{id}', [App\Http\Controllers\Administrativos\EdificioController::class, 'update'])->name('administrativos.edificios.update');
        Route::delete('/edificios/{id}', [App\Http\Controllers\Administrativos\EdificioController::class, 'destroy'])->name('administrativos.edificios.destroy');
        Route::get('/edificios/export', [App\Http\Controllers\Administrativos\EdificioController::class, 'export'])->name('administrativos.edificios.export');

        // Gestión de Establecimientos (Modalidades)
        Route::get('/establecimientos', [App\Http\Controllers\Administrativos\ModalidadController::class, 'index'])->name('administrativos.establecimientos.index');
        Route::post('/establecimientos', [App\Http\Controllers\Administrativos\ModalidadController::class, 'store'])->name('administrativos.establecimientos.store');
        Route::patch('/establecimientos/{id}', [App\Http\Controllers\Administrativos\ModalidadController::class, 'update'])->name('administrativos.establecimientos.update');
        Route::delete('/establecimientos/{id}', [App\Http\Controllers\Administrativos\ModalidadController::class, 'destroy'])->name('administrativos.establecimientos.destroy');
        Route::get('/establecimientos/export', [App\Http\Controllers\Administrativos\ModalidadController::class, 'export'])->name('administrativos.establecimientos.export');
        Route::get('/api/lookup-edificio/{cui}', [App\Http\Controllers\Administrativos\ModalidadController::class, 'lookupEdificio'])->name('api.lookup-edificio');
        Route::get('/api/lookup-cue/{cue}', [App\Http\Controllers\Administrativos\ModalidadController::class, 'lookupCue'])->name('api.lookup-cue');


        // Instrumentos Legales
        Route::get('/instrumentos', [App\Http\Controllers\Administrativos\ModalidadController::class, 'instrumentosIndex'])->name('administrativos.instrumentos.index');
        Route::patch('/instrumentos/{id}', [App\Http\Controllers\Administrativos\ModalidadController::class, 'instrumentosUpdate'])->name('administrativos.instrumentos.update');

        // Auditoría
        Route::get('/auditoria', [App\Http\Controllers\Administrativos\AuditoriaController::class, 'index'])->name('administrativos.auditoria.index');
        Route::patch('/auditoria/{id}/estado', [App\Http\Controllers\Administrativos\AuditoriaController::class, 'updateEstado'])->name('administrativos.auditoria.updateEstado');
        Route::get('/auditoria/{id}/vinculados', [App\Http\Controllers\Administrativos\AuditoriaController::class, 'vinculados'])->name('administrativos.auditoria.vinculados');
        Route::get('/auditoria/export-pdf', [App\Http\Controllers\Administrativos\AuditoriaController::class, 'exportPdf'])->name('administrativos.auditoria.exportPdf');
        Route::get('/auditoria/export-excel', [App\Http\Controllers\Administrativos\AuditoriaController::class, 'exportExcel'])->name('administrativos.auditoria.exportExcel');
        Route::get('/auditoria/{id}/pdf', [App\Http\Controllers\Admin\PDFController::class, 'downloadIndividual'])->name('administrativos.auditoria.pdf.individual');
        Route::get('/auditoria/pdf/general', [App\Http\Controllers\Admin\PDFController::class, 'downloadGeneral'])->name('administrativos.auditoria.pdf.general');

        // Reportes (Bandeja de Entrada)
        Route::get('/reportes', [App\Http\Controllers\Administrativos\ReporteController::class, 'index'])->name('administrativos.reportes.index');
        Route::patch('/reportes/{reporte}', [App\Http\Controllers\Administrativos\ReporteController::class, 'update'])->name('administrativos.reportes.update');
        Route::delete('/reportes/{reporte}', [App\Http\Controllers\Administrativos\ReporteController::class, 'destroy'])->name('administrativos.reportes.destroy');

        // Bitácora (Compartida)
        Route::get('/bitacora', [App\Http\Controllers\Admin\AdminController::class, 'logs'])->name('bitacora.index');
    });

    // --- CONSOLA ADMIN (Solo Administradores) ---
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/users', [App\Http\Controllers\Admin\AdminController::class, 'users'])->name('admin.users.index');
        Route::post('/users', [App\Http\Controllers\Admin\AdminController::class, 'storeUser'])->name('admin.users.store');
        Route::post('/users/{id}/reset', [App\Http\Controllers\Admin\AdminController::class, 'resetPassword'])->name('admin.users.reset');
        
        Route::get('/logs', [App\Http\Controllers\Admin\AdminController::class, 'logs'])->name('admin.logs.index');
        
        Route::get('/trash', [App\Http\Controllers\Admin\AdminController::class, 'trash'])->name('admin.trash.index');
        Route::post('/trash/{type}/{id}/restore', [App\Http\Controllers\Admin\AdminController::class, 'restore'])->name('admin.trash.restore');
        Route::delete('/trash/modalidad/{id}/force', [App\Http\Controllers\Admin\AdminController::class, 'forceDelete'])->name('admin.trash.forceDelete');
    });


});

