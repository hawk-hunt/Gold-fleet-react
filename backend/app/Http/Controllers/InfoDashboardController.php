<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Trip;
use App\Models\Service;
use App\Models\Expense;
use App\Models\FuelFillup;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class InfoDashboardController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;
        $cacheKey = "dashboard_stats_{$companyId}";
        
        // Cache for 5 minutes
        $stats = Cache::remember($cacheKey, 300, function() use ($companyId) {
            // Get all KPIs in optimized queries using aggregations
            $vehicleStats = Vehicle::where('company_id', $companyId)
                ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active")
                ->first();

            $driverStats = Driver::where('company_id', $companyId)
                ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active")
                ->first();

            $tripStats = Trip::where('company_id', $companyId)
                ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed")
                ->first();

            // Monthly aggregates - using database-agnostic method
            $monthlyTrips = Trip::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM created_at)::TEXT as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
                ->pluck('count', 'month')
                ->toArray();

            $monthlyExpenses = Expense::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM expense_date)::TEXT as month, SUM(amount) as total')
                ->whereYear('expense_date', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->pluck('total', 'month')
                ->toArray();

            $monthlyFuelCosts = FuelFillup::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM fillup_date)::TEXT as month, SUM(cost) as total')
                ->whereYear('fillup_date', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM fillup_date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM fillup_date)'))
                ->pluck('total', 'month')
                ->toArray();

            // Top vehicles without full vehicle relationship (lighter weight)
            $vehicleUtilization = Trip::where('company_id', $companyId)
                ->select('vehicle_id')
                ->selectRaw('COUNT(*) as trip_count, SUM(COALESCE(distance, 0)) as total_distance')
                ->whereNotNull('distance')
                ->groupBy('vehicle_id')
                ->orderBy('total_distance', 'desc')
                ->limit(10)
                ->get();

            // Recent issues - select only needed fields
            $recentIssues = Issue::where('company_id', $companyId)
                ->select('id', 'vehicle_id', 'title', 'priority', 'created_at')
                ->with(['vehicle:id,make,model,license_plate'])
                ->latest()
                ->limit(5)
                ->get();

            // Upcoming services - select only needed fields
            $upcomingServices = Service::where('company_id', $companyId)
                ->select('id', 'vehicle_id', 'service_type', 'service_date', 'status')
                ->with(['vehicle:id,make,model,license_plate'])
                ->where('service_date', '>=', now()->startOfDay())
                ->orderBy('service_date')
                ->limit(5)
                ->get();

            // Calculate derived metrics
            $totalExpenses = Expense::where('company_id', $companyId)
                ->whereYear('created_at', date('Y'))
                ->sum('amount') ?? 0;

            $totalCostOfOwnership = $totalExpenses + ($monthlyFuelCosts ? array_sum($monthlyFuelCosts) : 0);
            
            // Calculate average MPG from fuel fillups (computed from odometer deltas and gallons)
            $averageMpg = FuelFillup::where('company_id', $companyId)
                ->whereNotNull('mpg')
                ->where('mpg', '>', 0)
                ->avg('mpg') ?? 8.5;

            // Downtime not tracked; use default 0
            $downtimeDays = 0;

            return [
                'total_vehicles' => $vehicleStats->total ?? 0,
                'active_vehicles' => $vehicleStats->active ?? 0,
                'total_drivers' => $driverStats->total ?? 0,
                'active_drivers' => $driverStats->active ?? 0,
                'total_trips' => $tripStats->total ?? 0,
                'completed_trips' => $tripStats->completed ?? 0,
                'monthly_trips' => $monthlyTrips,
                'monthly_expenses' => $monthlyExpenses,
                'monthly_fuel_costs' => $monthlyFuelCosts,
                'vehicle_utilization' => $vehicleUtilization,
                'recent_issues' => $recentIssues,
                'upcoming_services' => $upcomingServices,
                'total_cost' => round($totalCostOfOwnership, 2),
                'total_expenses' => round($totalExpenses, 2),
                'avg_mpg' => round($averageMpg, 1),
                'downtime_days' => round($downtimeDays, 1),
                'cost_increase_percent' => 0,
                'overdue_reminders' => 0,
                'open_issues' => count($recentIssues),
                'maintenance_queue' => 0,
                'renewal_count' => 0,
                'cost_per_mile' => round($tripStats->total > 0 ? $totalCostOfOwnership / $tripStats->total : 0, 2),
                'cost_per_day' => round($totalCostOfOwnership / 30, 2),
                'recentIssues' => $recentIssues,
                'upcomingServices' => $upcomingServices,
            ];
        });

        return response()->json($stats);
    }

    public function getChartData(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $cacheKey = "chart_data_{$companyId}";
        
        // Cache chart data for 10 minutes to reduce query load
        $data = Cache::remember($cacheKey, 600, function() use ($companyId) {
            // Get monthly expenses
            $expensesData = Expense::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM expense_date)::INTEGER as month, SUM(amount) as value')
                ->whereYear('expense_date', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->get();

            // Get monthly fuel costs (as revenue/income proxy for now)
            $revenueData = FuelFillup::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM fillup_date)::INTEGER as month, SUM(cost) as value')
                ->whereYear('fillup_date', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM fillup_date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM fillup_date)'))
                ->get();

            // Build chart data with months as labels (Jan through Dec)
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $labels = [];
            $expenses = [];
            $revenue = [];

            for ($i = 1; $i <= 12; $i++) {
                $labels[] = $months[$i - 1];
                
                $expenseValue = $expensesData->where('month', $i)->first();
                $expenses[] = $expenseValue ? (float) $expenseValue->value : 0;
                
                $revenueValue = $revenueData->where('month', $i)->first();
                $revenue[] = $revenueValue ? (float) $revenueValue->value : 0;
            }

            return [
                'labels' => $labels,
                'expenses' => $expenses,
                'revenue' => $revenue,
            ];
        });

        return response()->json($data);
    }
}
