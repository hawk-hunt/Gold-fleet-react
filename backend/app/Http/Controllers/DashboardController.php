<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Mock data for the KPI cards
        $stats = [
            'total_cost' => 124500,
            'total_expense' => 45200,
            'downtime' => '12 hrs',
            'overdue_reminders' => 3,
            'maintenance_count' => 8,
            'renewal_count' => 2,
            'avg_mpg' => 22.4,
            'open_issues' => 5,
        ];

        return response()->json(['stats' => $stats]);
    }
}