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
        'fillup_date',
    ];

    protected $casts = [
        'gallons' => 'decimal:2',
        'cost_per_gallon' => 'decimal:3',
        'cost' => 'decimal:2',
        'odometer_reading' => 'decimal:2',
        'fillup_date' => 'date',
    ];

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
