<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and apply essential HTTP security headers.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking by forbidding embedding in iframes from other domains
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS filter in legacy browsers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy
        if (app()->isProduction()) {
            // Strict policy for production
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com; " .
                   "font-src 'self' data: https://fonts.bunny.net https://fonts.gstatic.com; " .
                   "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://server.arcgisonline.com https://unpkg.com; " .
                   "connect-src 'self' https://*.tile.openstreetmap.org https://server.arcgisonline.com ws: wss:; " .
                   "frame-ancestors 'self';";
        } else {
            // Development policy: allows Vite HMR, dev servers (127.0.0.1, localhost, IPv6) and tooling
            $csp = "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:; " .
                   "style-src 'self' 'unsafe-inline' http: https:; " .
                   "font-src 'self' data: http: https:; " .
                   "img-src 'self' data: blob: http: https:; " .
                   "connect-src 'self' http: https: ws: wss:; " .
                   "frame-ancestors 'self';";
        }
        $response->headers->set('Content-Security-Policy', $csp);

        // HSTS enforcement when request is secure or in production
        if ($request->isSecure() || app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
