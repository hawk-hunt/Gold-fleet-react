<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::with('vehicle')->get();
        return response()->json(['data' => $services]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Provide service details to create.']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'service_type' => 'required|string|max:255',
                'service_date' => 'required|date',
                'cost' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            ]);

            $validated['company_id'] = auth()->user()->company_id ?? 1;
            $validated['description'] = $validated['notes'] ?? '';
            $validated['status'] = $validated['status'] ?? 'completed';

            $service = Service::create($validated);
            return response()->json(['data' => $service->load('vehicle')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Service store error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return response()->json(['data' => $service->load('vehicle')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        return response()->json($service->load('vehicle'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'service_type' => 'required|string|max:255',
                'service_date' => 'required|date',
                'cost' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            ]);

            $validated['description'] = $validated['notes'] ?? '';

            $service->update($validated);
            return response()->json(['data' => $service->load('vehicle')]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Service update error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'service_id' => $service->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        try {
            $service->delete();
            return response()->json(['success' => true, 'message' => 'Service deleted successfully.']);
        } catch (\Exception $e) {
            \Log::error('Service delete error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'service_id' => $service->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service: ' . $e->getMessage(),
            ], 500);
        }
    }
}
