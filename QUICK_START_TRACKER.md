# Quick Start: Phone Tracker & Map Dashboard

## 30-Second Setup

### 1. **Start Your Servers**
```bash
# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 2. **Navigate to Map**
Open: `http://localhost:5174/dashboard/map`

### 3. **See Vehicles on Map**
You should see:
- OpenStreetMap with vehicle markers
- Status KPIs (Active, Moving, Stopped, Alerts)
- Vehicle lists and details

### 4. **Test Phone Tracker**
Click "📍 Simulate Tracker Update" button to:
- Update a vehicle's location
- Simulate GPS movement
- See map update in real-time

---

## Integration Examples

### **Integrate with Your Phone App**

#### Using JavaScript Geolocation API:
```javascript
import { api } from '@/services/api';

// Start tracking
const startTracking = () => {
  navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const speed = position.coords.speed || 0;
      
      await api.updateTrackerLocation({
        vehicle_id: 1,  // Your vehicle ID
        latitude,
        longitude,
        speed: speed * 2.237, // Convert m/s to mph
        heading: position.coords.heading || 0
      });
    },
    (error) => console.error('Geolocation error:', error),
    { enableHighAccuracy: true, maximumAge: 0 }
  );
};

startTracking();
```

#### Using Fetch API:
```javascript
const updateLocation = async (vehicleId, lat, lng, speed) => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/tracker/update-location', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vehicle_id: vehicleId,
      latitude: lat,
      longitude: lng,
      speed: speed,
      heading: 0  // Optional
    })
  });
  
  return response.json();
};

// Usage
updateLocation(1, 40.7128, -74.0060, 45.5);
```

#### Using React Hook:
```javascript
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export function usePhoneTracker(vehicleId) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const speed = position.coords.speed || 0;
          
          const result = await api.updateTrackerLocation({
            vehicle_id: vehicleId,
            latitude,
            longitude,
            speed: speed * 2.237,
            heading: position.coords.heading || 0
          });
          
          setLocation(result.location);
        } catch (err) {
          setError(err.message);
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, [vehicleId]);
  
  return { location, error };
}

// Usage in Component
function DriverTracker() {
  const { location, error } = usePhoneTracker(1);
  
  return (
    <div>
      {error ? <p>Error: {error}</p> : <p>Tracking at {location?.latitude}, {location?.longitude}</p>}
    </div>
  );
}
```

---

## API Quick Reference

### Update Location
```
POST /api/tracker/update-location
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_id": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180
}

Response (201):
{
  "success": true,
  "message": "Location updated",
  "location": { ... }
}
```

### Get Last Location
```
GET /api/tracker/last-location/1
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "vehicle_id": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "recorded_at": "2026-01-31T10:30:00Z"
}
```

### Simulate Update (Testing)
```
POST /api/tracker/simulate/1
Authorization: Bearer {token}

Response (201):
{
  "success": true,
  "message": "Location simulated",
  "location": { ... }
}
```

---

## Map Dashboard Features

### Visual Indicators
- **🟢 Green Marker**: Vehicle is moving (speed > 0)
- **🟡 Yellow Marker**: Vehicle is stopped (speed = 0)
- **🔴 Red Marker**: Vehicle has alert status

### Information Displayed
- Vehicle make/model
- License plate
- Current speed (mph)
- Last update time
- Latitude/Longitude coordinates
- Movement status

### Auto-Features
- Locations update every 30 seconds
- Caching for 60 seconds (for performance)
- KPIs update automatically
- Responsive design for all devices

---

## Testing Without Device

### Use the Simulator Button
1. Go to Map Dashboard
2. Click "📍 Simulate Tracker Update"
3. Watch vehicle location change
4. Check updated timestamp

### Use cURL
```bash
# Set your token
TOKEN="your_bearer_token"

# Update a location
curl -X POST http://localhost:8000/api/tracker/update-location \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 25.0,
    "heading": 90
  }'

# Simulate update
curl -X POST http://localhost:8000/api/tracker/simulate/1 \
  -H "Authorization: Bearer $TOKEN"

# Get last location
curl -X GET http://localhost:8000/api/tracker/last-location/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

### Map Not Showing
1. Check browser console (F12) for errors
2. Verify vehicles exist and are "active" status
3. Confirm you're logged in with valid token

### Locations Not Updating
1. Check that `/api/tracker/update-location` is being called
2. Verify Bearer token is valid
3. Ensure vehicle_id is correct
4. Check network tab in DevTools

### Slow Map Performance
1. Reduce number of vehicles
2. Check cache settings (currently 60 seconds)
3. Minimize popup details
4. Use map zoom to filter visible markers

---

## Production Checklist

- [ ] Test with real GPS data
- [ ] Implement battery optimization
- [ ] Handle network failures gracefully
- [ ] Add location history/cleanup
- [ ] Implement geofencing alerts
- [ ] Set up location update frequency
- [ ] Handle offline scenarios
- [ ] Add background location service
- [ ] Implement rate limiting
- [ ] Add location encryption for transit
- [ ] Monitor API performance
- [ ] Set up automated testing

---

## Next Steps

1. **Integrate with Real Device**
   - Use Geolocation API in your mobile app
   - Send location updates as vehicle moves

2. **Add Features**
   - Route playback
   - Speed alerts
   - Geofence notifications
   - Trip history

3. **Optimize**
   - Reduce update frequency for battery
   - Compress location data
   - Archive old records

---

## Support Files

- `PHONE_TRACKER_GUIDE.md` - Full API documentation
- `MAP_DASHBOARD_ARCHITECTURE.md` - System architecture diagrams
- `MAP_DASHBOARD_SETUP.md` - Complete setup guide

---

**You're all set! Start tracking vehicle locations now! 🗺️📍**
