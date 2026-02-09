# Map Simulation Feature

## Overview
Added a continuous vehicle simulation feature to the map dashboard that allows realistic movement of vehicles across the map.

## Features

### 1. **SimulationService** (Backend)
- `startSimulation($companyId, $interval)` - Initiates continuous simulation for all active vehicles
- `stopSimulation($companyId)` - Stops the simulation
- `isSimulationActive($companyId)` - Checks if simulation is currently running
- `updateVehicleLocation($vehicleId)` - Updates a single vehicle's location with realistic movement
- `updateAllVehicleLocations($companyId)` - Batch updates all vehicles

**Features:**
- Vehicles move in continuous directions with ~20% chance to change direction
- Speed varies randomly between 0-70 mph
- Movement is ~50-200 meters per update
- Uses cache to track simulation state
- Automatically clears map cache for real-time updates

### 2. **SimulationController** (Backend)
New API endpoints:
- `POST /api/simulation/start` - Start continuous vehicle simulation
- `POST /api/simulation/stop` - Stop the simulation
- `GET /api/simulation/status` - Check if simulation is active
- `POST /api/simulation/update` - Manually trigger location updates (for polling)

### 3. **Frontend UI Updates**
- **Start/Stop Buttons**: Toggle continuous vehicle simulation
- **Single Update Button**: Trigger one-off tracker update
- **Status Indicator**: Shows when simulation is active with pulse animation
- **Auto-polling**: Fetches location updates every 5 seconds during simulation

### 4. **How to Use**

#### Start the Servers
```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Initialize Data
```bash
# Seed initial vehicle locations
php artisan seed:vehicle-locations
```

#### Use the Simulation
1. Navigate to `http://localhost:5174/dashboard/map`
2. Click **▶️ Start Simulation** to begin continuous vehicle movement
3. Watch vehicles move around the map with random speeds
4. Click **⏹️ Stop Simulation** to halt movement
5. Use **📍 Single Update** for one-off location updates

## Technical Details

### Vehicle Movement Algorithm
```
1. Fetch last location for vehicle
2. Randomly change direction (20% chance)
3. Calculate new position based on direction and distance:
   - Distance: 50-200 meters per update
   - Uses trigonometry: cos(radians) and sin(radians)
4. Random speed: 0-70 mph
5. Store new location in database
```

### Cache Keys
- `simulation_active_{company_id}` - Tracks if simulation is running
- `vehicle_simulation_{vehicle_id}` - Stores direction and config for each vehicle

### Polling Strategy
- Frontend checks simulation status on page load
- If active, sets 5-second interval for location updates
- Updates automatically clear and refresh the map
- Manual location loads still occur every 30 seconds

## API Examples

### Start Simulation
```bash
curl -X POST http://localhost:8000/api/simulation/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"interval": 5}'
```

### Check Status
```bash
curl -X GET http://localhost:8000/api/simulation/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Stop Simulation
```bash
curl -X POST http://localhost:8000/api/simulation/stop \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Manual Update (for testing)
```bash
curl -X POST http://localhost:8000/api/simulation/update \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Files Created/Modified

### Created:
- ✅ `backend/app/Services/SimulationService.php` - Core simulation logic
- ✅ `backend/app/Http/Controllers/SimulationController.php` - API controller

### Modified:
- ✅ `backend/routes/api.php` - Added simulation routes
- ✅ `frontend/src/services/api.js` - Added simulation API methods
- ✅ `frontend/src/pages/MapDashboard.jsx` - Enhanced UI with controls

## Status
✅ Complete and ready to test
