<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MapDashboardController;
use App\Http\Controllers\InfoDashboardController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FuelFillupController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;

// This application is now API-only for frontend rendering.
// Keep auth routes for API authentication if needed.

Route::get('/', function () {
    return response()->json([
        'message' => 'This Laravel server serves API endpoints only. Please use the React frontend at http://localhost:5173'
    ]);
});

// Any direct web routes that previously returned Blade views have been moved to `routes/api.php`.
require __DIR__.'/auth.php';
