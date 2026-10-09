<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip if user is not authenticated
        if (! Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // Skip if already on the change password page or submitting the change
        if ($request->routeIs('auth.change-password*')) {
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
