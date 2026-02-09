<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $issues = Issue::with('vehicle')->get();
        return response()->json(['data' => $issues]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Provide issue details to create.']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|in:low,medium,high,critical',
            'status' => 'nullable|in:open,in_progress,resolved,closed',
            'reported_date' => 'nullable|date',
        ]);

        $validated['company_id'] = auth()->user()->company_id ?? 1;
        $validated['severity'] = $validated['priority'] ?? 'medium';
        $validated['status'] = $validated['status'] ?? 'open';
        $validated['reported_date'] = $validated['reported_date'] ?? now();

        $issue = Issue::create($validated);
        return response()->json(['data' => $issue->load('vehicle')], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Issue $issue)
    {
        return response()->json(['data' => $issue->load('vehicle')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Issue $issue)
    {
        return response()->json($issue->load('vehicle'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|in:low,medium,high,critical',
            'status' => 'nullable|in:open,in_progress,resolved,closed',
            'reported_date' => 'nullable|date',
        ]);

        $validated['severity'] = $validated['priority'] ?? $issue->severity;

        $issue->update($validated);
        return response()->json(['data' => $issue->load('vehicle')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Issue $issue)
    {
        $issue->delete();
        return response()->json(['success' => true, 'message' => 'Issue deleted successfully.']);
    }
}
