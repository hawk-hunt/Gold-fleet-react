```
╔════════════════════════════════════════════════════════════════════════════╗
║                     PHONE TRACKER & MAP DASHBOARD SYSTEM                   ║
╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  MapDashboard.jsx                                                         │
│  ├── State: locations[], loading, error                                  │
│  ├── Effects:                                                            │
│  │   ├── Load locations on mount                                        │
│  │   ├── Auto-refresh every 30 seconds                                  │
│  │   └── Auto-cleanup on unmount                                        │
│  │                                                                        │
│  └── Components:                                                         │
│      ├── KPI Cards (Active, Moving, Stopped, Alerts)                   │
│      │   └── Data: vehicle counts, status                               │
│      │                                                                    │
│      ├── MapContainer (Leaflet)                                         │
│      │   ├── TileLayer (OpenStreetMap)                                 │
│      │   │   └── URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
│      │   │                                                               │
│      │   └── Markers (for each vehicle location)                        │
│      │       ├── Position: [latitude, longitude]                        │
│      │       ├── Icon: Custom divIcon (30x30px circle)                 │
│      │       │   ├── Green (speed > 0) = Moving                        │
│      │       │   ├── Yellow (no speed) = Stopped                       │
│      │       │   └── Red (alert) = Alert Status                        │
│      │       │                                                           │
│      │       └── Popup:                                                 │
│      │           ├── Vehicle make/model                                 │
│      │           ├── License plate                                      │
│      │           ├── Status (moving/stopped/alert)                      │
│      │           ├── Speed (mph)                                        │
│      │           └── Last update time                                   │
│      │                                                                    │
│      ├── Simulator Button                                               │
│      │   └── Calls: api.simulateTrackerUpdate(vehicleId)               │
│      │                                                                    │
│      ├── Stopped Vehicles List                                          │
│      │   └── Shows: idle/parked vehicles with timestamps                │
│      │                                                                    │
│      ├── Active Routes List                                             │
│      │   └── Shows: moving vehicles with speed & coordinates            │
│      │                                                                    │
│      └── All Locations Grid                                             │
│          └── Shows: status, speed, updated time for each vehicle        │
│                                                                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                     HTTP Requests (Axios)
                                 │
                    Token: Bearer auth_token
                                 │
                 ┌────────────────┴────────────────┐
                 │                                 │
          ┌──────▼───────┐            ┌───────────▼──────┐
          │ GET Locations│            │ Simulate Update  │
          └──────┬───────┘            └───────────┬──────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                        BACKEND (Laravel 11)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  API Routes (api.php)                                               │
│  ├── GET  /api/vehicle-locations                                   │
│  ├── POST /api/tracker/update-location                             │
│  ├── GET  /api/tracker/last-location/{vehicleId}                   │
│  └── POST /api/tracker/simulate/{vehicleId}                        │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ MapDashboardController                                         │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │ getVehicleLocations()                                         │  │
│  │  ├─ Query: Latest vehicle locations per company              │  │
│  │  ├─ Filters:                                                 │  │
│  │  │  ├─ company_id matches auth user                         │  │
│  │  │  └─ vehicle status = 'active'                            │  │
│  │  ├─ Select: id, vehicle_id, lat, lng, speed, recorded_at   │  │
│  │  ├─ With: vehicle (make, model, license_plate)              │  │
│  │  ├─ Cache: 60 seconds (vehicle_locations_{companyId})        │  │
│  │  └─ Return: Array of locations                               │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ PhoneTrackerController                                         │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │ updateLocation(Request $request)                              │  │
│  │  ├─ Validate: vehicle_id, latitude, longitude, speed         │  │
│  │  ├─ Check: vehicle belongs to auth user's company            │  │
│  │  ├─ Store: VehicleLocation::create()                         │  │
│  │  ├─ Clear Cache: vehicle_locations & map_dashboard           │  │
│  │  └─ Return: Created location object (201)                    │  │
│  │                                                                │  │
│  │ simulateTrackerUpdate(vehicleId)                              │  │
│  │  ├─ Get: Last location for vehicle                           │  │
│  │  ├─ Simulate: Small random offset (±50 coords)               │  │
│  │  ├─ Random: speed (0-65 mph), heading (0-360°)               │  │
│  │  ├─ Store: VehicleLocation::create() with new data           │  │
│  │  ├─ Clear Cache: vehicle_locations & map_dashboard           │  │
│  │  └─ Return: New location object (201)                        │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                    Database Access (Eloquent)
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                         SQLite Database                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                     │
│  vehicle_locations Table                                           │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ id               INT PRIMARY KEY                             │ │
│  │ vehicle_id       INT FOREIGN KEY → vehicles.id               │ │
│  │ latitude         DECIMAL(10, 8) - GPS latitude              │ │
│  │ longitude        DECIMAL(11, 8) - GPS longitude             │ │
│  │ speed            DECIMAL(5, 2) - mph                        │ │
│  │ heading          DECIMAL(5, 2) - degrees (0-360)            │ │
│  │ recorded_at      TIMESTAMP - When location was recorded     │ │
│  │ alert_status     VARCHAR - Optional alert (speeding, etc)   │ │
│  │ created_at       TIMESTAMP - Record creation time           │ │
│  │ updated_at       TIMESTAMP - Last update time               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  vehicles Table (related)                                          │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ id, make, model, license_plate, status, company_id, ...     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────┘


╔═════════════════════════════════════════════════════════════════════╗
║                          DATA FLOW DIAGRAM                           ║
╚═════════════════════════════════════════════════════════════════════╝

1. MAP LOAD FLOW:
   ┌──────────────┐     GET /vehicle-locations      ┌──────────────┐
   │   Browser    │────────────────────────────────→│   Laravel    │
   │   MapDash.   │                                │   API Server │
   │   loads      │                                │   (port 8000)│
   └──────┬───────┘                                └────────┬─────┘
          │                                                 │
          │ Check cache: vehicle_locations_{companyId}    │
          │                                                 │
          └──────────────────┬──────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              Cache HIT         Cache MISS
              (60 sec)           (Query DB)
                    │                 │
                    └────────┬────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │ Return Location Array [{            │
          │   id, vehicle_id, lat, lng,         │
          │   speed, recorded_at,               │
          │   vehicle: {make, model, plate}     │
          │ }, ...]                             │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Browser receives JSON locations   │
          │  setLocations(locationsArray)      │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Render Map with Markers for each  │
          │  location at [lat, lng] with icon  │
          └──────────────────────────────────────┘


2. TRACKER UPDATE FLOW (Simulator):
   ┌──────────────────┐    Click Button       ┌──────────────────┐
   │   MapDashboard   │─────────────────────→ │   Simulator      │
   │   Simulator Btn  │                       │   Function       │
   └──────┬───────────┘                       └────────┬─────────┘
          │                                           │
          │   POST /api/tracker/simulate/{vehicleId}  │
          ├─────────────────────────────────────────→│
          │   with Bearer Token                       │
          │                                           │
          │ Backend:                                  │
          │  1. Find last location for vehicle        │
          │  2. Calculate random offset (~5km)        │
          │  3. Randomize speed (0-65) & heading     │
          │  4. Create new VehicleLocation record     │
          │  5. Clear cache                           │
          │  6. Return new location                   │
          │                                           │
          └──────────────────┬──────────────────────┬─┘
                             │                      │
                    Returns Location        Auto-refresh
                    in 30 seconds triggers
                             │                      │
          ┌──────────────────▼──────────────────────▼──┐
          │  Browser fetches updated locations again   │
          │  setLocations(updatedArray)                │
          └──────────────────┬───────────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │  Map updates with new positions     │
          │  Markers move, KPIs recalculate    │
          └──────────────────────────────────────┘


╔═════════════════════════════════════════════════════════════════════╗
║                        SAMPLE DATA EXAMPLE                           ║
╚═════════════════════════════════════════════════════════════════════╝

GET /api/vehicle-locations Response:
────────────────────────────────────────

[
  {
    "id": 1,
    "vehicle_id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 45.5,
    "heading": 180,
    "recorded_at": "2026-01-31T10:30:00Z",
    "alert_status": null,
    "vehicle": {
      "id": 1,
      "make": "Ford",
      "model": "F-150",
      "license_plate": "ABC-1234",
      "status": "active"
    }
  },
  {
    "id": 2,
    "vehicle_id": 2,
    "latitude": 40.7589,
    "longitude": -73.9851,
    "speed": 0,
    "heading": 90,
    "recorded_at": "2026-01-31T10:29:15Z",
    "alert_status": null,
    "vehicle": {
      "id": 2,
      "make": "Chevrolet",
      "model": "Silverado",
      "license_plate": "XYZ-5678",
      "status": "active"
    }
  }
]

Vehicle 1: Moving (45.5 mph) - Green Marker
Vehicle 2: Stopped (0 mph)   - Yellow Marker
```

## Map Dashboard System Architecture

### Key Components

1. **Frontend (React)**
   - MapDashboard.jsx: Main component
   - Leaflet: Map rendering
   - OpenStreetMap: Tile provider
   - Custom icons: Color-coded status

2. **Backend (Laravel)**
   - MapDashboardController: Get locations
   - PhoneTrackerController: Handle tracker updates
   - Database: Store location history

3. **Real-time Features**
   - Auto-refresh: Every 30 seconds
   - Cache: 60 seconds for performance
   - Caching clears on new updates

4. **Phone Tracker Integration**
   - `updateLocation`: Real GPS from device
   - `simulateTrackerUpdate`: Testing/demo
   - Color-coded status indicator

### Performance Optimizations

- Location data cached for 60 seconds
- Only latest location per vehicle shown
- Queries filtered by company_id
- Auto-cleanup of old location records (optional)

### Security

- All endpoints require Bearer token authentication
- Company data isolation (company_id checks)
- Vehicle ownership verification
- Input validation on all tracker updates
