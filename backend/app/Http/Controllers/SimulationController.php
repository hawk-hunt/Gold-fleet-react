<?php

namespace App\Http\Controllers;

use App\Services\SimulationService;
use Illuminate\Http\Request;

class SimulationController extends Controller
{
    /**
     * Start vehicle simulation for the company
     */
    public function start(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $interval = $request->input('interval', 5);

        $result = SimulationService::startSimulation($companyId, $interval);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Stop vehicle simulation
     */
    public function stop(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $result = SimulationService::stopSimulation($companyId);

        return response()->json($result, 200);
    }

    /**
     * Get simulation status
     */
    public function status(Request $request)
    {
        $companyId = auth()->user()->company_id;
        $isActive = SimulationService::isSimulationActive($companyId);

        return response()->json([
            'active' => $isActive,
            'company_id' => $companyId
        ]);
    }

    /**
     * Manual trigger to update all vehicle locations (for testing/polling)
     */
    public function update(Request $request)
    {
        $companyId = auth()->user()->company_id;
        
        if (!SimulationService::isSimulationActive($companyId)) {
            return response()->json([
                'success' => false,
                'message' => 'Simulation is not active',
                'active' => false
            ], 400);
        }

        $result = SimulationService::updateAllVehicleLocations($companyId);

        return response()->json([
            'success' => true,
            'updated' => $result['updated'],
            'total' => $result['total'],
            'active' => true
        ]);
    }
}
