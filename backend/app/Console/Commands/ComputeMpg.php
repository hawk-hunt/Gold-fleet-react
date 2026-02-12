<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\FuelFillup;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;

class ComputeMpg extends Command
{
    protected $signature = 'compute:mpg {--company= : company id to limit to}';

    protected $description = 'Compute and populate mpg values for fuel fillups based on odometer deltas and gallons.';

    public function handle()
    {
        $company = $this->option('company');

        $this->info('Computing MPG for fuel fillups...');

        $processed = 0;

        // Process per vehicle to compute consecutive deltas
        $vehicleIds = FuelFillup::query()
            ->when($company, fn($q) => $q->where('company_id', $company))
            ->distinct('vehicle_id')
            ->pluck('vehicle_id');

        foreach ($vehicleIds as $vehicleId) {
            $fillups = FuelFillup::where('vehicle_id', $vehicleId)->orderBy('fillup_date')->get();
            $prevOdo = null;
            foreach ($fillups as $f) {
                $odo = $f->odometer ?? $f->odometer_reading ?? null;
                $gallons = $f->gallons ?? 0;
                if ($prevOdo !== null && $odo !== null && $gallons > 0) {
                    $distance = floatval($odo) - floatval($prevOdo);
                    if ($distance > 0) {
                        $mpg = round($distance / floatval($gallons), 2);
                        $f->mpg = $mpg;
                        $f->save();
                        $processed++;
                    }
                }
                $prevOdo = $odo;
            }
        }

        $this->info("Done. MPG updated for {$processed} records.");
        return 0;
    }
}
