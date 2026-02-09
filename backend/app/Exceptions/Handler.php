<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into a response.
     */
    public function render($request, Throwable $exception)
    {
        // Check if request is expecting JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleJsonException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle exceptions as JSON responses for API requests
     */
    private function handleJsonException($request, Throwable $exception)
    {
        // Validation exception
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $exception->errors(),
            ], 422);
        }

        // Model not found exception
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found',
            ], 404);
        }

        // Not found exception
        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found',
            ], 404);
        }

        // Database related errors
        if ($exception instanceof \Illuminate\Database\QueryException) {
            \Log::error('Database error: ' . $exception->getMessage(), [
                'user_id' => auth()->id(),
                'sql' => $exception->getSql(),
                'bindings' => $exception->getBindings(),
                'exception' => $exception,
            ]);

            // Determine the specific error
            if (strpos($exception->getMessage(), 'not-null constraint') !== false ||
                strpos($exception->getMessage(), 'violates not-null') !== false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing required field(s). Please ensure all required fields are provided.',
                    'debug' => explode("ERROR:", $exception->getMessage())[1] ?? null,
                ], 422);
            }

            if (strpos($exception->getMessage(), 'Duplicate entry') !== false ||
                strpos($exception->getMessage(), 'duplicate key') !== false) {
                return response()->json([
                    'success' => false,
                    'message' => 'This record already exists',
                ], 409);
            }

            if (strpos($exception->getMessage(), 'foreign key constraint') !== false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot perform this operation. Related data exists or referenced record not found.',
                ], 409);
            }

            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $exception->getMessage(),
            ], 500);
        }

        // Generic exception
        $statusCode = method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500;

        \Log::error('Exception: ' . $exception->getMessage(), [
            'user_id' => auth()->id(),
            'exception' => $exception,
        ]);

        return response()->json([
            'success' => false,
            'message' => env('APP_DEBUG') ? $exception->getMessage() : 'An error occurred',
        ], $statusCode);
    }
}
