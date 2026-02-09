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

            return [
                'totalVehicles' => $vehicleStats->total ?? 0,
                'activeVehicles' => $vehicleStats->active ?? 0,
                'totalDrivers' => $driverStats->total ?? 0,
                'activeDrivers' => $driverStats->active ?? 0,
                'totalTrips' => $tripStats->total ?? 0,
                'completedTrips' => $tripStats->completed ?? 0,
                'monthlyTrips' => $monthlyTrips,
                'monthlyExpenses' => $monthlyExpenses,
                'monthlyFuelCosts' => $monthlyFuelCosts,
                'vehicleUtilization' => $vehicleUtilization,
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
            $data['expenses'] = Expense::where('company_id', $companyId)
                ->selectRaw('EXTRACT(MONTH FROM expense_date)::TEXT as period, SUM(amount) as value')
                ->whereYear('expense_date', date('Y'))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM expense_date)'))
                ->pluck('value', 'period')
                ->toArray();

            return $data;
        });

        return response()->json($data);
    }
}
