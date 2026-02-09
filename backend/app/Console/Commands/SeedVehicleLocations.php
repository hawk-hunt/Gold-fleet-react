<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use App\Models\VehicleLocation;
use Illuminate\Console\Command;

class SeedVehicleLocations extends Command
{
    protected $signature = 'seed:vehicle-locations';
    protected $description = 'Add sample vehicle locations for testing';

    public function handle()
    {
        $this->info('Seeding vehicle locations...');

        // Sample coordinates for different areas (New York area)
        $locations = [
            ['lat' => 40.7128, 'lng' => -74.0060, 'name' => 'New York (Downtown)'],
            ['lat' => 40.7589, 'lng' => -73.9851, 'name' => 'Times Square'],
            ['lat' => 40.7614, 'lng' => -73.9776, 'name' => 'Central Park'],
            ['lat' => 40.6501, 'lng' => -73.9496, 'name' => 'Brooklyn'],
            ['lat' => 40.6892, 'lng' => -74.0445, 'name' => 'New Jersey'],
        ];

        // Get active vehicles for company 1
        $vehicles = Vehicle::where('company_id', 1)->where('status', 'active')->take(5)->get();

        if ($vehicles->isEmpty()) {
            $this->warn('No active vehicles found for company 1. Please create vehicles first.');
            return;
        }

        foreach ($vehicles as $index => $vehicle) {
            $location = $locations[$index % count($locations)];
            
            // Add some variation to coordinates
            $lat = $location['lat'] + (rand(-100, 100) / 10000);
            $lng = $location['lng'] + (rand(-100, 100) / 10000);
            $speed = rand(0, 65); // 0-65 mph

            VehicleLocation::create([
                'vehicle_id' => $vehicle->id,
                'latitude' => $lat,
                'longitude' => $lng,
                'speed' => $speed,
                'heading' => rand(0, 360),
                'recorded_at' => now(),
                'alert_status' => rand(0, 10) > 8 ? 'speeding' : null, // 20% chance of alert
            ]);

            $this->info("Added location for {$vehicle->make} {$vehicle->model} at {$location['name']}");
        }

        $this->info('Vehicle locations seeded successfully!');
    }
}
