<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Expense::with('vehicle')->get();
        return response()->json(['data' => $expenses]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Provide expense details to create.']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'category' => 'required|in:fuel,maintenance,repair,insurance,tolls,parking,registration,inspection,other',
                'amount' => 'required|numeric|min:0',
                'expense_date' => 'required|date',
                'notes' => 'nullable|string',
            ]);

            $validated['company_id'] = auth()->user()->company_id ?? 1;
            $validated['description'] = $validated['notes'] ?? '';
            $validated['status'] = 'approved';

            $expense = Expense::create($validated);
            return response()->json(['data' => $expense->load('vehicle')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Expense store error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        return response()->json(['data' => $expense->load('vehicle')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        return response()->json($expense->load('vehicle'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
                'category' => 'required|in:fuel,maintenance,repair,insurance,tolls,parking,registration,inspection,other',
                'amount' => 'required|numeric|min:0',
                'expense_date' => 'required|date',
                'notes' => 'nullable|string',
            ]);

            $validated['description'] = $validated['notes'] ?? '';

            $expense->update($validated);
            return response()->json(['data' => $expense->load('vehicle')]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Expense update error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'expense_id' => $expense->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        try {
            $expense->delete();
            return response()->json(['success' => true, 'message' => 'Expense deleted successfully.']);
        } catch (\Exception $e) {
            \Log::error('Expense delete error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'expense_id' => $expense->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete expense: ' . $e->getMessage(),
            ], 500);
        }
    }
}
