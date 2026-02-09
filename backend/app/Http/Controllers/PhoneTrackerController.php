<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleLocation;
use Illuminate\Http\Request;

class PhoneTrackerController extends Controller
{
    /**
     * Store location update from phone tracker app
     * Expected payload: { vehicle_id, latitude, longitude, speed, heading }
     */
    public function updateLocation(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'speed' => 'nullable|numeric|min:0',
            'heading' => 'nullable|numeric|between:0,360',
        ]);

        // Verify vehicle belongs to user's company
        $vehicle = Vehicle::find($validated['vehicle_id']);
        if ($vehicle->company_id !== auth()->user()->company_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Store the location
        $location = VehicleLocation::create([
            'vehicle_id' => $validated['vehicle_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'speed' => $validated['speed'] ?? 0,
            'heading' => $validated['heading'] ?? 0,
            'recorded_at' => now(),
        ]);

        // Clear cache so map updates
        \Illuminate\Support\Facades\Cache::forget("vehicle_locations_{$vehicle->company_id}");
        \Illuminate\Support\Facades\Cache::forget("map_dashboard_{$vehicle->company_id}");

        return response()->json([
            'success' => true,
            'message' => 'Location updated',
            'location' => $location
        ], 201);
    }

    /**
     * Get last location for a vehicle
     */
    public function getLastLocation($vehicleId)
    {
        $vehicle = Vehicle::findOrFail($vehicleId);
        
        if ($vehicle->company_id !== auth()->user()->company_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $location = VehicleLocation::where('vehicle_id', $vehicleId)
            ->orderBy('recorded_at', 'desc')
            ->first();

        if (!$location) {
            return response()->json(['error' => 'No location data'], 404);
        }

        return response()->json($location);
    }

    /**
     * Simulate phone tracker updates (for testing)
     */
    public function simulateTrackerUpdate(Request $request)
    {
        $vehicleId = $request->input('vehicle_id');
        $vehicle = Vehicle::findOrFail($vehicleId);

        if ($vehicle->company_id !== auth()->user()->company_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get last location or create initial one
        $lastLocation = VehicleLocation::where('vehicle_id', $vehicleId)
            ->orderBy('recorded_at', 'desc')
            ->first();

        if (!$lastLocation) {
            return response()->json(['error' => 'No previous location. Please update location first.'], 404);
        }

        // Simulate movement (small random offset)
        $newLat = $lastLocation->latitude + (rand(-50, 50) / 10000);
        $newLng = $lastLocation->longitude + (rand(-50, 50) / 10000);
        $newSpeed = rand(0, 65);

        $location = VehicleLocation::create([
            'vehicle_id' => $vehicleId,
            'latitude' => $newLat,
            'longitude' => $newLng,
            'speed' => $newSpeed,
            'heading' => rand(0, 360),
            'recorded_at' => now(),
        ]);

        // Clear cache
        \Illuminate\Support\Facades\Cache::forget("vehicle_locations_{$vehicle->company_id}");
        \Illuminate\Support\Facades\Cache::forget("map_dashboard_{$vehicle->company_id}");

        return response()->json([
            'success' => true,
            'message' => 'Location simulated',
            'location' => $location
        ], 201);
    }
}
