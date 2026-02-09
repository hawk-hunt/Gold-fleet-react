<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use Illuminate\Http\Request;

class InspectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inspections = Inspection::with('vehicle', 'driver', 'driver.user')->get();
        return response()->json(['data' => $inspections]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Provide inspection details to create.']);
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
                'inspection_date' => 'required|date',
                'notes' => 'required|string|min:1',
                'result' => 'nullable|in:pass,fail,conditional_pass',
                'next_due_date' => 'nullable|date',
            ]);

            $validated['company_id'] = auth()->user()->company_id ?? 1;
            $validated['result'] = $validated['result'] ?? 'pending';
            $validated['status'] = $request->input('status', 'passed');

            $inspection = Inspection::create($validated);
            return response()->json(['data' => $inspection->load('vehicle', 'driver')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Inspection store error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create inspection: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Inspection $inspection)
    {
        return response()->json(['data' => $inspection->load('vehicle', 'driver', 'driver.user')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inspection $inspection)
    {
        return response()->json($inspection->load('vehicle', 'driver', 'driver.user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inspection $inspection)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'driver_id' => 'required|integer|exists:drivers,id',
                'inspection_date' => 'required|date',
                'notes' => 'required|string|min:1',
                'result' => 'nullable|in:pass,fail,conditional_pass',
                'next_due_date' => 'nullable|date',
            ]);

            $validated['status'] = $request->input('status', 'passed');

            $inspection->update($validated);
            return response()->json(['data' => $inspection->load('vehicle', 'driver', 'driver.user')]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Inspection update error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'inspection_id' => $inspection->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update inspection: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inspection $inspection)
    {
        try {
            $inspection->delete();
            return response()->json(['success' => true, 'message' => 'Inspection deleted successfully.']);
        } catch (\Exception $e) {
            \Log::error('Inspection delete error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'inspection_id' => $inspection->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete inspection: ' . $e->getMessage(),
            ], 500);
        }
    }
}
