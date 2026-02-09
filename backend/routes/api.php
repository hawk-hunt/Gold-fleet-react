<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
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
use App\Http\Controllers\PhoneTrackerController;
use App\Http\Controllers\SimulationController;

// API routes for frontend consumption. These return JSON and are prefixed with /api by the framework.

// Auth routes (public)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Email verification removed - verification endpoints are disabled for API-based flow

// Protected routes (require valid api_token)
Route::middleware('authorize.api.token')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard data
    Route::get('/dashboard', [InfoDashboardController::class, 'index']);
    Route::get('/dashboard/info/chart-data', [InfoDashboardController::class, 'getChartData']);
    Route::get('/vehicle-locations', [MapDashboardController::class, 'getVehicleLocations']);

    // Phone Tracker
    Route::post('/tracker/update-location', [PhoneTrackerController::class, 'updateLocation']);
    Route::get('/tracker/last-location/{vehicleId}', [PhoneTrackerController::class, 'getLastLocation']);
    Route::post('/tracker/simulate/{vehicleId}', [PhoneTrackerController::class, 'simulateTrackerUpdate']);

    // Vehicle Simulation
    Route::post('/simulation/start', [SimulationController::class, 'start']);
    Route::post('/simulation/stop', [SimulationController::class, 'stop']);
    Route::get('/simulation/status', [SimulationController::class, 'status']);
    Route::post('/simulation/update', [SimulationController::class, 'update']);

    // Resource endpoints
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('drivers', DriverController::class);
    Route::apiResource('trips', TripController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('inspections', InspectionController::class);
    Route::apiResource('issues', IssueController::class);
    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource('fuel-fillups', FuelFillupController::class);
    Route::apiResource('reminders', ReminderController::class);

    // Profile and notifications
    Route::get('/profile', [ProfileController::class, 'edit']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
});
