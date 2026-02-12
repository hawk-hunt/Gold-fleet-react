<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get or create a test company
try {
    // Try to get first company without soft delete check
    $company = \Illuminate\Support\Facades\DB::table('companies')->first();
    if (!$company) {
        // Insert directly to bypass soft delete issues
        $companyId = \Illuminate\Support\Facades\DB::table('companies')->insertGetId([
            'name' => 'Test Fleet Company',
            'registration_number' => 'TFC001',
            'phone' => '+233123456789',
            'email' => 'fleet@testcompany.com',
            'address' => 'Accra, Ghana',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $company = \Illuminate\Support\Facades\DB::table('companies')->find($companyId);
        echo "Created test company with ID: {$companyId}\n";
    } else {
        echo "Using existing company: {$company->id}\n";
    }
} catch (\Exception $e) {
    echo "Error with companies table: " . $e->getMessage() . "\n";
    // Fallback: use company_id = 1
    $companyId = 1;
}

// Create test vehicles
$vehicles = [];
$timestamp = now()->timestamp % 10000;  // Get unique suffix
for ($i = 1; $i <= 3; $i++) {
    $vinCode = 'VIN' . str_pad($timestamp + $i, 5, '0', STR_PAD_LEFT);
    
    // Check if this VIN already exists
    $exists = \Illuminate\Support\Facades\DB::table('vehicles')->where('vin', $vinCode)->exists();
    if ($exists) {
        echo "Vehicle with VIN {$vinCode} already exists, skipping...\n";
        $vehicle = \Illuminate\Support\Facades\DB::table('vehicles')->where('vin', $vinCode)->value('id');
        $vehicles[] = $vehicle;
        continue;
    }
    
    $vehicle = \Illuminate\Support\Facades\DB::table('vehicles')->insertGetId([
        'company_id' => $companyId ?? $company->id,
        'make' => ['Toyota', 'Honda', 'Hyundai'][$i - 1],
        'model' => ['Hiace', 'Odyssey', 'Elantra'][$i - 1],
        'year' => 2022,
        'license_plate' => 'GH-' . str_pad($timestamp + $i, 4, '0', STR_PAD_LEFT) . '-' . chr(65 + (($i - 1) % 26)),
        'vin' => $vinCode,
        'status' => 'active',
        'fuel_capacity' => 60,
        'fuel_type' => 'petrol',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $vehicles[] = $vehicle;
}

echo "Created " . count($vehicles) . " test vehicles\n";

// Create test drivers (need users first)
$drivers = [];
for ($i = 1; $i <= 2; $i++) {
    $email = 'driver' . $i . '@fleet.local';
    
    // Check if user already exists
    $userId = \Illuminate\Support\Facades\DB::table('users')->where('email', $email)->value('id');
    if (!$userId) {
        $userId = \Illuminate\Support\Facades\DB::table('users')->insertGetId([
            'company_id' => $companyId ?? $company->id,
            'name' => 'Test Driver ' . $i,
            'email' => $email,
            'password' => bcrypt('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    
    // Check if driver already exists for this user
    $driverId = \Illuminate\Support\Facades\DB::table('drivers')->where('user_id', $userId)->value('id');
    if (!$driverId) {
        $licenseNum = 'DL' . str_pad($i, 6, '0', STR_PAD_LEFT);
        $driverId = \Illuminate\Support\Facades\DB::table('drivers')->insertGetId([
            'company_id' => $companyId ?? $company->id,
            'user_id' => $userId,
            'license_number' => $licenseNum,
            'license_expiry' => now()->addYears(3)->format('Y-m-d'),
            'phone' => '+233' . (70000000 + $i),
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    $drivers[] = $driverId;
}

echo "Using " . count($drivers) . " drivers\n";

// Create test fuel fillups with realistic progression
foreach ($vehicles as $vidx => $vehicleId) {
    $baseOdo = 50000;
    $baseDate = now()->subMonths(3);
    $driverId = $drivers[$vidx % count($drivers)];
    
    // Create 5 fuel fillups per vehicle with progressive odometer readings
    for ($f = 0; $f < 5; $f++) {
        $odometreReading = $baseOdo + ($f * 1200); // Progressive odometer
        $gallons = 50 + rand(-10, 10);
        $costPerGallon = 12.5;
        $totalCost = round($gallons * $costPerGallon, 2);
        
        $fillupData = [
            'company_id' => $companyId ?? $company->id,
            'vehicle_id' => $vehicleId,
            'driver_id' => $driverId,
            'odometer_reading' => $odometreReading,
            'gallons' => $gallons,
            'cost_per_gallon' => $costPerGallon,
            'cost' => $totalCost,
            'fillup_date' => $baseDate->copy()->addDays($f * 20)->format('Y-m-d'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Insert via DB first
        $fillupId = \Illuminate\Support\Facades\DB::table('fuel_fillups')->insertGetId($fillupData);
        
        // Now reload and save via model to trigger the booted() hook for MPG calculation
        $fillup = \App\Models\FuelFillup::find($fillupId);
        if ($fillup) {
            $fillup->save();  // This triggers the MPG calculation hook
        }
    }
}

echo "Created " . (count($vehicles) * 5) . " test fuel fillups\n";

// Verify MPG calculations
$withMpg = \App\Models\FuelFillup::whereNotNull('mpg')->where('mpg', '>', 0)->count();
$avgMpg = \App\Models\FuelFillup::whereNotNull('mpg')->where('mpg', '>', 0)->avg('mpg');

echo "\nFuel Fillups with calculated MPG: {$withMpg}\n";
echo "Average MPG: " . ($avgMpg ? round($avgMpg, 2) : 'N/A') . "\n";
