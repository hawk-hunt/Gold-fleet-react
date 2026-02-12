<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Database Record Counts ===\n";
echo "Vehicles: " . \App\Models\Vehicle::count() . "\n";
echo "Drivers: " . \App\Models\Driver::count() . "\n";
echo "Trips: " . \App\Models\Trip::count() . "\n";
echo "Expenses: " . \App\Models\Expense::count() . "\n";
echo "Fuel Fillups: " . \App\Models\FuelFillup::count() . "\n";
echo "Fuel Fillups with MPG: " . \App\Models\FuelFillup::whereNotNull('mpg')->where('mpg', '>', 0)->count() . "\n";
