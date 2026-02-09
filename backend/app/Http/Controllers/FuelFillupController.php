<?php

namespace App\Http\Controllers;

use App\Models\FuelFillup;
use Illuminate\Http\Request;

class FuelFillupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fuelFillups = FuelFillup::with('vehicle', 'driver', 'driver.user')->get();
        return response()->json(['data' => $fuelFillups]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Provide fuel fill-up details to create.']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'driver_id' => 'required|integer|exists:drivers,id',
                'gallons' => 'required|numeric|min:0.01',
                'cost' => 'required|numeric|min:0',
                'fillup_date' => 'required|date',
                'odometer_reading' => 'required|numeric|min:0',
            ]);

            // Prevent division by zero
            if ($validated['gallons'] <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gallons must be greater than 0',
                    'errors' => ['gallons' => ['Gallons must be greater than 0']],
                ], 422);
            }

            $validated['company_id'] = auth()->user()->company_id ?? 1;
            $validated['cost_per_gallon'] = round($validated['cost'] / $validated['gallons'], 3);

            $fuelFillup = FuelFillup::create($validated);
            return response()->json(['data' => $fuelFillup->load('vehicle', 'driver', 'driver.user')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('FuelFillup store error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create fuel fill-up: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FuelFillup $fuelFillup)
    {
        return response()->json(['data' => $fuelFillup->load('vehicle', 'driver', 'driver.user')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FuelFillup $fuelFillup)
    {
        return response()->json($fuelFillup->load('vehicle', 'driver', 'driver.user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FuelFillup $fuelFillup)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'driver_id' => 'required|integer|exists:drivers,id',
                'gallons' => 'required|numeric|min:0.01',
                'cost' => 'required|numeric|min:0',
                'fillup_date' => 'required|date',
                'odometer_reading' => 'required|numeric|min:0',
            ]);

            // Prevent division by zero
            if ($validated['gallons'] <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gallons must be greater than 0',
                    'errors' => ['gallons' => ['Gallons must be greater than 0']],
                ], 422);
            }

            $validated['cost_per_gallon'] = round($validated['cost'] / $validated['gallons'], 3);

            $fuelFillup->update($validated);
            return response()->json(['data' => $fuelFillup->load('vehicle', 'driver', 'driver.user')]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('FuelFillup update error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'fuelFillup_id' => $fuelFillup->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update fuel fill-up: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FuelFillup $fuelFillup)
    {
        try {
            $fuelFillup->delete();
            return response()->json(['success' => true, 'message' => 'Fuel fill-up deleted successfully.']);
        } catch (\Exception $e) {
            \Log::error('FuelFillup delete error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'fuelFillup_id' => $fuelFillup->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete fuel fill-up: ' . $e->getMessage(),
            ], 500);
        }
    }
}
