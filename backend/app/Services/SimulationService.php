<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\VehicleLocation;
use Illuminate\Support\Facades\Cache;

class SimulationService
{
    /**
     * Start continuous simulation for multiple vehicles
     * Creates simulated movement at specified intervals
     */
    public static function startSimulation($companyId, $interval = 5)
    {
        // Check if simulation is already running
        if (Cache::get("simulation_active_{$companyId}")) {
            return [
                'success' => false,
                'message' => 'Simulation already running for this company',
                'active' => true
            ];
        }

        // Mark simulation as active
        Cache::put("simulation_active_{$companyId}", true, now()->addDays(1));

        // Get all active vehicles for the company
        $vehicles = Vehicle::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        if ($vehicles->isEmpty()) {
            Cache::forget("simulation_active_{$companyId}");
            return [
                'success' => false,
                'message' => 'No active vehicles found',
                'active' => false
            ];
        }

        // Initialize or update starting positions for each vehicle
        foreach ($vehicles as $vehicle) {
            $lastLocation = VehicleLocation::where('vehicle_id', $vehicle->id)
                ->orderBy('recorded_at', 'desc')
                ->first();

            if (!$lastLocation) {
                // Create initial location if none exists
                VehicleLocation::create([
                    'vehicle_id' => $vehicle->id,
                    'latitude' => 40.7128 + (rand(-100, 100) / 1000),
                    'longitude' => -74.0060 + (rand(-100, 100) / 1000),
                    'speed' => 0,
                    'heading' => 0,
                    'recorded_at' => now(),
                ]);
            }

            // Store simulation config for this vehicle
            Cache::put("vehicle_simulation_{$vehicle->id}", [
                'direction' => rand(0, 360),
                'started_at' => now()
            ], now()->addDays(1));
        }

        return [
            'success' => true,
            'message' => 'Simulation started for ' . count($vehicles) . ' vehicles',
            'active' => true,
            'vehicles_count' => count($vehicles)
        ];
    }

    /**
     * Stop simulation for a company
     */
    public static function stopSimulation($companyId)
    {
        Cache::forget("simulation_active_{$companyId}");

        // Clear vehicle simulation configs
        $vehicles = Vehicle::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        foreach ($vehicles as $vehicle) {
            Cache::forget("vehicle_simulation_{$vehicle->id}");
        }

        return [
            'success' => true,
            'message' => 'Simulation stopped',
            'active' => false
        ];
    }

    /**
     * Check if simulation is active
     */
    public static function isSimulationActive($companyId)
    {
        return Cache::get("simulation_active_{$companyId}", false);
    }

    /**
     * Update a single vehicle's location during simulation
     * Called periodically to move vehicles
     */
    public static function updateVehicleLocation($vehicleId)
    {
        $vehicle = Vehicle::findOrFail($vehicleId);
        
        $lastLocation = VehicleLocation::where('vehicle_id', $vehicleId)
            ->orderBy('recorded_at', 'desc')
            ->first();

        if (!$lastLocation) {
            return null;
        }

        // Get or create simulation config
        $simConfig = Cache::get("vehicle_simulation_{$vehicleId}", [
            'direction' => rand(0, 360),
            'started_at' => now()
        ]);

        // Randomly change direction (20% chance)
        if (rand(1, 100) <= 20) {
            $simConfig['direction'] = rand(0, 360);
        }

        // Calculate movement based on direction (in decimal degrees)
        // ~0.00001 degrees = ~1 meter
        $distance = rand(5, 20) / 100000; // 50-200 meters per update
        $radians = deg2rad($simConfig['direction']);
        
        $newLat = $lastLocation->latitude + ($distance * cos($radians));
        $newLng = $lastLocation->longitude + ($distance * sin($radians));

        // Random speed (0-70 mph)
        $newSpeed = rand(0, 70);

        // Create new location
        $location = VehicleLocation::create([
            'vehicle_id' => $vehicleId,
            'latitude' => $newLat,
            'longitude' => $newLng,
            'speed' => $newSpeed,
            'heading' => $simConfig['direction'],
            'recorded_at' => now(),
        ]);

        // Update simulation config
        Cache::put("vehicle_simulation_{$vehicleId}", $simConfig, now()->addDays(1));

        // Clear map cache
        Cache::forget("vehicle_locations_{$vehicle->company_id}");
        Cache::forget("map_dashboard_{$vehicle->company_id}");

        return $location;
    }

    /**
     * Batch update all simulated vehicles
     */
    public static function updateAllVehicleLocations($companyId)
    {
        if (!self::isSimulationActive($companyId)) {
            return ['updated' => 0];
        }

        $vehicles = Vehicle::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        $count = 0;
        foreach ($vehicles as $vehicle) {
            try {
                self::updateVehicleLocation($vehicle->id);
                $count++;
            } catch (\Exception $e) {
                \Log::error("Failed to update vehicle {$vehicle->id}: " . $e->getMessage());
            }
        }

        return ['updated' => $count, 'total' => count($vehicles)];
    }
}
