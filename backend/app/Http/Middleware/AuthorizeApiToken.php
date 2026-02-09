<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeApiToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('Authorization');

        if ($token && str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        if ($token) {
            $user = \App\Models\User::where('api_token', $token)->first();
            if ($user) {
                Auth::setUser($user);
                return $next($request);
            }
        }

        // Return 401 Unauthorized with JSON response
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated',
        ], 401);
    }
}
