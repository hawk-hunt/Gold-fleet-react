<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Add CORS middleware as early middleware to handle all responses including errors
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);
        
        $middleware->alias([
            'auth.api' => \App\Http\Middleware\AuthorizeApiToken::class,
            'authorize.api.token' => \App\Http\Middleware\AuthorizeApiToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle validation exceptions
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // Handle database exceptions (QueryException from Laravel)
        $exceptions->render(function (\Illuminate\Database\QueryException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                \Log::error('Database error: ' . $e->getMessage(), [
                    'user_id' => auth()->id(),
                    'sql' => $e->getSql(),
                ]);

                // Not null constraint violation
                if (strpos($e->getMessage(), 'not-null constraint') !== false ||
                    strpos($e->getMessage(), 'violates not-null') !== false) {
                    $parts = explode('column "', $e->getMessage());
                    $columnPart = $parts[1] ?? 'unknown';
                    $column = explode('"', $columnPart)[0];
                    
                    return response()->json([
                        'success' => false,
                        'message' => "Missing required field: $column",
                    ], 422);
                }

                // Duplicate key violation
                if (strpos($e->getMessage(), 'Duplicate') !== false ||
                    strpos($e->getMessage(), 'duplicate key') !== false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This record already exists',
                    ], 409);
                }

                // Foreign key constraint
                if (strpos($e->getMessage(), 'foreign key') !== false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid foreign key reference. Related record does not exist.',
                    ], 409);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Database error: ' . $e->getMessage(),
                ], 500);
            }
        });

        // Handle PDOException directly (database driver errors)
        $exceptions->render(function (\PDOException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                \Log::error('PDO Database error: ' . $e->getMessage());

                // Not null constraint violation
                if (strpos($e->getMessage(), 'not-null constraint') !== false ||
                    strpos($e->getMessage(), 'violates not-null') !== false) {
                    $parts = explode('column "', $e->getMessage());
                    $columnPart = $parts[1] ?? 'unknown';
                    $column = explode('"', $columnPart)[0];
                    
                    return response()->json([
                        'success' => false,
                        'message' => "Missing required field: $column",
                    ], 422);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Database error occurred',
                ], 500);
            }
        });

        // Handle model not found exceptions
        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Record not found',
                ], 404);
            }
        });

        // Handle generic exceptions for JSON
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                \Log::error('Exception: ' . $e->getMessage(), [
                    'user_id' => auth()->id(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => env('APP_DEBUG') ? $e->getMessage() : 'An error occurred',
                ], 500);
            }
        });
    })->create();
