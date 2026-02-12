<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    private function normalizeOrigin(string $origin): string
    {
        return rtrim(trim($origin), '/');
    }

    public function handle(Request $request, Closure $next): Response
    {
        $requestOrigin = $this->normalizeOrigin((string) $request->headers->get('Origin', ''));
        $rawAllowedOrigins = (string) env('CLIENT_ORIGIN', '*');
        $allowedOrigins = array_values(array_filter(array_map(
            fn ($origin) => $this->normalizeOrigin((string) $origin),
            explode(',', $rawAllowedOrigins)
        )));
        $origin = '*';

        if (!in_array('*', $allowedOrigins, true) && $requestOrigin !== '') {
            if (in_array($requestOrigin, $allowedOrigins, true)) {
                $origin = $requestOrigin;
            } else {
                $origin = '';
            }
        }

        // Handle CORS preflight before routing to avoid 405 Method Not Allowed.
        if ($request->getMethod() === 'OPTIONS') {
            $response = response()->noContent(204);
        } else {
            $response = $next($request);
        }

        if ($origin !== '') {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }
        $response->headers->set('Vary', 'Origin');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        return $response;
    }
}
