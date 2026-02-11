<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $requestOrigin = (string) $request->headers->get('Origin', '');
        $rawAllowedOrigins = (string) env('CLIENT_ORIGIN', '*');
        $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $rawAllowedOrigins))));
        $origin = '*';

        if (!in_array('*', $allowedOrigins, true) && $requestOrigin !== '') {
            if (in_array($requestOrigin, $allowedOrigins, true)) {
                $origin = $requestOrigin;
            } else {
                $origin = '';
            }
        }

        if ($origin !== '') {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }
        $response->headers->set('Vary', 'Origin');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(204);
        }

        return $response;
    }
}
