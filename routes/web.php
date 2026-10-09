<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PDFController;
use App\Http\Controllers\Administrativos\AuditoriaController;
use App\Http\Controllers\Administrativos\EdificioController;
use App\Http\Controllers\Administrativos\ModalidadController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Publico\MapaController;
use App\Http\Controllers\Publico\ReporteController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Public Routes
 */
Route::redirect('/', '/mapa')->name('home');

Route::get('/mapa', [MapaController::class, 'index'])->name('mapa.publico');
Route::post('/reportes', [ReporteController::class, 'store'])
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
        /** @var User $user */
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
        Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
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
        Route::get('/edificios', [EdificioController::class, 'index'])->name('administrativos.edificios.index');
        Route::post('/edificios', [EdificioController::class, 'store'])->name('administrativos.edificios.store');
        Route::patch('/edificios/{id}', [EdificioController::class, 'update'])->name('administrativos.edificios.update');
        Route::delete('/edificios/{id}', [EdificioController::class, 'destroy'])->name('administrativos.edificios.destroy');
        Route::get('/edificios/export', [EdificioController::class, 'export'])->name('administrativos.edificios.export');

        // Gestión de Establecimientos (Modalidades)
        Route::get('/establecimientos', [ModalidadController::class, 'index'])->name('administrativos.establecimientos.index');
        Route::post('/establecimientos', [ModalidadController::class, 'store'])->name('administrativos.establecimientos.store');
        Route::patch('/establecimientos/{id}', [ModalidadController::class, 'update'])->name('administrativos.establecimientos.update');
        Route::delete('/establecimientos/{id}', [ModalidadController::class, 'destroy'])->name('administrativos.establecimientos.destroy');
        Route::get('/establecimientos/export', [ModalidadController::class, 'export'])->name('administrativos.establecimientos.export');
        Route::get('/api/lookup-edificio/{cui}', [ModalidadController::class, 'lookupEdificio'])->name('api.lookup-edificio');
        Route::get('/api/lookup-cue/{cue}', [ModalidadController::class, 'lookupCue'])->name('api.lookup-cue');

        // Reportes (Bandeja de Entrada)
        Route::get('/reportes', [App\Http\Controllers\Administrativos\ReporteController::class, 'index'])->name('administrativos.reportes.index');
        Route::patch('/reportes/{reporte}', [App\Http\Controllers\Administrativos\ReporteController::class, 'update'])->name('administrativos.reportes.update');
        Route::delete('/reportes/{reporte}', [App\Http\Controllers\Administrativos\ReporteController::class, 'destroy'])->name('administrativos.reportes.destroy');
    });

    /**
     * Rutas de Auditoría e Instrumentos (Solo Administradores / Super Admin)
     */
    Route::middleware(['role:admin'])->prefix('administrativos')->group(function () {
        // Instrumentos Legales
        Route::get('/instrumentos', [ModalidadController::class, 'instrumentosIndex'])->name('administrativos.instrumentos.index');
        Route::patch('/instrumentos/{id}', [ModalidadController::class, 'instrumentosUpdate'])->name('administrativos.instrumentos.update');

        // Auditoría
        Route::get('/auditoria', [AuditoriaController::class, 'index'])->name('administrativos.auditoria.index');
        Route::patch('/auditoria/{id}/estado', [AuditoriaController::class, 'updateEstado'])->name('administrativos.auditoria.updateEstado');
        Route::get('/auditoria/{id}/vinculados', [AuditoriaController::class, 'vinculados'])->name('administrativos.auditoria.vinculados');
        Route::get('/auditoria/export-pdf', [AuditoriaController::class, 'exportPdf'])->name('administrativos.auditoria.exportPdf');
        Route::get('/auditoria/export-excel', [AuditoriaController::class, 'exportExcel'])->name('administrativos.auditoria.exportExcel');
        Route::get('/auditoria/{id}/pdf', [PDFController::class, 'downloadIndividual'])->name('administrativos.auditoria.pdf.individual');
        Route::get('/auditoria/pdf/general', [PDFController::class, 'downloadGeneral'])->name('administrativos.auditoria.pdf.general');
    });

    // --- CONSOLA ADMIN (Solo Administradores) ---
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('admin.users.store');
        Route::post('/users/{id}/reset', [AdminController::class, 'resetPassword'])->name('admin.users.reset');

        Route::get('/logs', [AdminController::class, 'logs'])->name('admin.logs.index');

        Route::get('/trash', [AdminController::class, 'trash'])->name('admin.trash.index');
        Route::post('/trash/{type}/{id}/restore', [AdminController::class, 'restore'])->name('admin.trash.restore');
        Route::delete('/trash/modalidad/{id}/force', [AdminController::class, 'forceDelete'])->name('admin.trash.forceDelete');
    });

    // Redirección de compatibilidad para la antigua ruta de bitácora (Solo Administradores)
    Route::middleware(['role:admin'])->get('/administrativos/bitacora', function () {
        return redirect()->route('admin.logs.index');
    })->name('bitacora.index');

});
