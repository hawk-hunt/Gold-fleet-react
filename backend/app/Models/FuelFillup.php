<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FuelFillup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'vehicle_id',
        'driver_id',
        'gallons',
        'cost_per_gallon',
        'cost',
        'odometer_reading',
        'mpg',
        'fillup_date',
    ];

    protected $casts = [
        'gallons' => 'decimal:2',
        'cost_per_gallon' => 'decimal:3',
        'cost' => 'decimal:2',
        'odometer_reading' => 'decimal:2',
        'mpg' => 'decimal:2',
        'fillup_date' => 'date',
    ];

    protected static function booted()
    {
        // Compute MPG automatically before saving a fillup when possible
        static::saving(function (FuelFillup $fillup) {
            $odometer = $fillup->odometer_reading ?? null;
            $gallons = $fillup->gallons ?? 0;

            if ($fillup->vehicle_id && $odometer !== null && $gallons > 0) {
                $prev = self::where('vehicle_id', $fillup->vehicle_id)
                    ->where(function ($q) use ($fillup) {
                        if ($fillup->fillup_date) {
                            $q->where('fillup_date', '<=', $fillup->fillup_date);
                        }
                    })
                    ->where('id', '<>', $fillup->id ?? 0)
                    ->whereNotNull('odometer_reading')
                    ->orderBy('fillup_date', 'desc')
                    ->orderBy('id', 'desc')
                    ->first();

                $prevOdo = $prev->odometer_reading ?? null;
                if ($prev && $prevOdo !== null) {
                    $distance = floatval($odometer) - floatval($prevOdo);
                    if ($distance > 0 && $gallons > 0) {
                        $fillup->mpg = round($distance / floatval($gallons), 2);
                    }
                }
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
