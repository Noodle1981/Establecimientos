<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip if user is not authenticated
        if (!auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();

        // Skip if already on the change password page
        if ($request->routeIs('auth.change-password')) {
            return $next($request);
        }

        // Skip if on logout route
        if ($request->routeIs('logout')) {
            return $next($request);
        }

        // Check if user needs to change password (password_changed_at is null)
        if (is_null($user->password_changed_at)) {
            return redirect()->route('auth.change-password');
        }

        return $next($request);
    }
}
