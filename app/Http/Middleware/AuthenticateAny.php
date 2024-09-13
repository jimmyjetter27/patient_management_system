<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAny
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('sanctum')->check()) {
            Auth::setUser(Auth::guard('sanctum')->user());
            return $next($request);
        }

        if (Auth::guard('web')->check()) {
            Auth::setUser(Auth::guard('web')->user());
            return $next($request);
        }


        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated'], 401);
    }
}
