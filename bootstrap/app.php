<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'password.change' => \App\Http\Middleware\RequirePasswordChange::class,
        ]);
        
        // Require password change on first login
        // $middleware->web(append: [
        //     \App\Http\Middleware\RequirePasswordChange::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Reportar solo errores críticos o de emergencia
        $exceptions->reportable(function (\Throwable $e) {
            if ($e instanceof \Symfony\Component\ErrorHandler\Error\FatalError || 
                $e instanceof \Illuminate\Database\QueryException) {
                \Illuminate\Support\Facades\Log::critical('SPOF Detectado: ' . $e->getMessage(), [
                    'exception' => $e,
                    'url' => request()->fullUrl(),
                ]);
            }
        });

        $exceptions->respond(function ($response, $e, $request) {
            if (! app()->environment(['local', 'testing']) && $response->getStatusCode() === 500) {
                return Inertia::render('Error', ['status' => 500])
                    ->toResponse($request)
                    ->setStatusCode(500);
            }
 
            if ($response->getStatusCode() === 404 && $request->header('X-Inertia')) {
                return Inertia::render('Error', ['status' => 404])
                    ->toResponse($request)
                    ->setStatusCode(404);
            }
 
            return $response;
        });
    })->create();
