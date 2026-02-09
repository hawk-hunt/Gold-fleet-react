# Phone Tracker Integration Guide

## Overview
Your Gold Fleet application now includes phone tracker integration for real-time vehicle location tracking. The system displays vehicle locations on an interactive map with status indicators.

## Features

### 1. **Map Dashboard**
- **Location**: Navigate to `/dashboard/map`
- **Live Map**: Shows all active vehicles on OpenStreetMap
- **Vehicle Markers**: Color-coded by status:
  - 🟢 Green: Vehicle is moving
  - 🟡 Yellow: Vehicle is stopped/idle
  - 🔴 Red: Alert status
- **Auto-Refresh**: Updates every 30 seconds automatically
- **Popup Details**: Click any marker to see:
  - Vehicle make/model
  - License plate
  - Current speed
  - Last update time
  - Current status

### 2. **Vehicle Status KPIs**
- Active Vehicles: Count of all active vehicles with location data
- Moving: Vehicles currently in transit (speed > 0)
- Stopped: Vehicles that are idle or parked
- Alerts: Vehicles with alert status

### 3. **Real-Time Lists**
- **Stopped Vehicles**: List of all parked/idle vehicles with last update time
- **Active Routes**: List of vehicles currently moving with speed and coordinates
- **All Vehicle Locations**: Grid view of all tracked vehicles

## Phone Tracker API Endpoints

### Update Location
**Endpoint**: `POST /api/tracker/update-location`

**Request Body**:
```json
{
  "vehicle_id": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180
}
```

**Response**:
```json
{
  "success": true,
  "message": "Location updated",
  "location": {
    "id": 1,
    "vehicle_id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 45.5,
    "heading": 180,
    "recorded_at": "2026-01-31T10:30:00Z"
  }
}
```

### Get Last Location
**Endpoint**: `GET /api/tracker/last-location/{vehicleId}`

**Response**:
```json
{
  "id": 1,
  "vehicle_id": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180,
  "recorded_at": "2026-01-31T10:30:00Z"
}
```

### Simulate Tracker Update
**Endpoint**: `POST /api/tracker/simulate/{vehicleId}`

Simulates a phone tracker GPS update with slight location variation (for testing)

**Response**:
```json
{
  "success": true,
  "message": "Location simulated",
  "location": { /* ... */ }
}
```

## Frontend API Methods

Use these in your React components:

```javascript
import { api } from '../services/api';

// Update vehicle location from phone tracker
await api.updateTrackerLocation({
  vehicle_id: 1,
  latitude: 40.7128,
  longitude: -74.0060,
  speed: 45.5,
  heading: 180
});

// Get last location for a vehicle
const location = await api.getLastTrackerLocation(vehicleId);

// Simulate tracker update (testing)
await api.simulateTrackerUpdate(vehicleId);
```

## Integration Steps

### For Mobile App (Phone Tracker)
1. Collect GPS location using device's Geolocation API
2. Get current speed (if available)
3. Get heading/direction (if available)
4. Call the `/api/tracker/update-location` endpoint with:
   - Authentication: Bearer token in Authorization header
   - Vehicle ID
   - Latitude/Longitude
   - Speed (optional)
   - Heading (optional)

### Example JavaScript (Geolocation):
```javascript
navigator.geolocation.watchPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;
    const speed = position.coords.speed || 0;
    
    await api.updateTrackerLocation({
      vehicle_id: vehicleId,
      latitude,
      longitude,
      speed: speed * 2.237, // Convert m/s to mph
    });
  },
  (error) => console.error('Geolocation error:', error),
  { enableHighAccuracy: true, maximumAge: 0 }
);
```

## Testing

### Using the Simulator
1. Go to Map Dashboard (`/dashboard/map`)
2. Click "📍 Simulate Tracker Update" button
3. Watch the map update with new location
4. The first vehicle in the list will have its position slightly adjusted
5. Speed and heading are randomized

### Manual Testing with cURL
```bash
# Set your authentication token
TOKEN="your_bearer_token"

# Update location
curl -X POST http://localhost:8000/api/tracker/update-location \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 45.5,
    "heading": 180
  }'

# Simulate update
curl -X POST http://localhost:8000/api/tracker/simulate/1 \
  -H "Authorization: Bearer $TOKEN"

# Get last location
curl -X GET http://localhost:8000/api/tracker/last-location/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Database Schema

### vehicle_locations Table
```
id              - Primary key
vehicle_id      - Foreign key to vehicles table
latitude        - Decimal (8 places)
longitude       - Decimal (8 places)
speed           - Decimal (2 places) - in mph
heading         - Decimal (2 places) - 0-360 degrees
recorded_at     - Timestamp
created_at      - Timestamp
updated_at      - Timestamp
```

## Real-World Implementation

For production use with actual phone trackers:

1. **Mobile App Integration**: Integrate with Geolocation API on mobile devices
2. **Frequency**: Send updates every 30-60 seconds based on movement
3. **Battery Optimization**: Use background location services efficiently
4. **Fallback Handling**: Gracefully handle GPS unavailability
5. **Data Retention**: Implement archival of old location data (older than 30 days)

## Troubleshooting

### Map Not Showing
- Ensure vehicles exist and are marked as "active"
- Check browser console for errors
- Verify authentication token is valid

### Locations Not Updating
- Confirm phone tracker is sending data to correct endpoint
- Check `/api/tracker/update-location` is receiving requests
- Verify authentication on API requests

### Auto-Refresh Not Working
- Check browser console for errors
- Ensure geolocation permissions are granted
- Verify API token hasn't expired

## Features Coming Soon
- [ ] Geofencing alerts
- [ ] Route history/playback
- [ ] Battery optimization for phone tracker
- [ ] Offline mode with sync
- [ ] Custom marker icons per driver
- [ ] Speed alerts
- [ ] Trip analytics based on GPS data
