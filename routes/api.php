<?php

use App\Http\Controllers\Api\V1\EstablecimientoApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Health check para monitorización de servicios externos
    Route::get('/status', function () {
        return response()->json([
            'status' => 'online',
            'service' => 'API Establecimientos Educativos M.E.',
            'version' => 'v1',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // Rutas protegidas bajo Bearer Token (Sanctum) con Rate Limiting (60 peticiones/min)
    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::get('/establecimientos', [EstablecimientoApiController::class, 'index'])
            ->name('api.v1.establecimientos.index');

        Route::get('/establecimientos/{identifier}', [EstablecimientoApiController::class, 'show'])
            ->name('api.v1.establecimientos.show');
    });
});
