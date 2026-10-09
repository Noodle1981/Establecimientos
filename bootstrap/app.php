<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RequirePasswordChange;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\ErrorHandler\Error\FatalError;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SecurityHeaders::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            RequirePasswordChange::class,
        ]);

        $middleware->alias([
            'role' => CheckRole::class,
            'password.change' => RequirePasswordChange::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Reportar solo errores críticos o de emergencia
        $exceptions->reportable(function (Throwable $e) {
            if ($e instanceof FatalError ||
                $e instanceof QueryException) {
                Log::critical('SPOF Detectado: '.$e->getMessage(), [
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
