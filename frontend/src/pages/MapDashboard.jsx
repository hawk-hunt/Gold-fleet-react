import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for phone location
const phoneIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'phone-marker'
});

// Custom icon for live tracking (pulsing blue dot)
const liveTrackingIcon = L.divIcon({
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'live-tracking-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 70%, rgba(59, 130, 246, 0.1) 100%);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 1), 0 0 10px 3px rgba(59, 130, 246, 0.3);
      position: relative;
      animation: pulse 2s infinite;
    "></div>
  `
});

export default function MapDashboard() {
  const [tracking, setTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [watchId, setWatchId] = useState(null);

  const defaultCenter = [5.6037, -0.1870];
  const defaultZoom = 10;

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc, speed: spd } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setAccuracy(Math.round(acc));
        setSpeed(spd ? Math.round(spd * 3.6) : 0);
        setSuccess('✓ Current location captured');
        setTimeout(() => setSuccess(''), 3000);
      },
      (err) => setError(`Location Error: ${err.message}`)
    );
  };

  // Start continuous tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setError('');
    setTracking(true);
    setLocationHistory([]);
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc, speed: spd } = position.coords;
        const newLocation = [latitude, longitude];
        
        setCurrentLocation({ latitude, longitude });
        setAccuracy(Math.round(acc));
        setSpeed(spd ? Math.round(spd * 3.6) : 0);
        setLocationHistory(prev => [...prev, newLocation].slice(-100)); // Keep last 100
        setSuccess('🔴 LIVE TRACKING');
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        setTracking(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    setWatchId(id);
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setSuccess('Tracking stopped');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 1), 0 0 10px 3px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.6), 0 0 15px 5px rgba(59, 130, 246, 0.2);
          }
          100% {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 1), 0 0 10px 3px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Map Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time vehicle tracking and location monitoring</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
          {success}
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-md p-6 text-white">
        <h2 className="text-lg font-bold mb-4">📱 Phone Tracking Control</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={getCurrentLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📍 Get Current Location
          </button>
          {!tracking ? (
            <button
              onClick={startTracking}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              ▶️ Start Live Tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              ⏹️ Stop Tracking
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
        <MapContainer
          center={currentLocation ? [currentLocation.latitude, currentLocation.longitude] : defaultCenter}
          zoom={currentLocation ? 14 : defaultZoom}
          style={{ height: '600px', width: '100%' }}
          className="rounded-lg"
          key={currentLocation ? `${currentLocation.latitude}-${currentLocation.longitude}` : 'default'}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />

          {/* Tracking Trail */}
          {locationHistory.length > 1 && (
            <Polyline
              positions={locationHistory}
              color="#3B82F6"
              weight={3}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}

          {/* Current Phone Location */}
          {currentLocation && (
            <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={liveTrackingIcon}>
              <Popup>
                <div className="text-sm font-semibold">
                  <p className="text-blue-600">📱 Your Location</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Lat: {currentLocation.latitude.toFixed(4)}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Lon: {currentLocation.longitude.toFixed(4)}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Speed: {speed} km/h
                  </p>
                  <p className="text-gray-600 text-xs">
                    Accuracy: ±{accuracy}m
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Sample Depot Markers */}
          <Marker position={defaultCenter} icon={phoneIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Main Depot</p>
                <p className="text-gray-600">Accra, Ghana</p>
              </div>
            </Popup>
          </Marker>

          <Marker position={[5.7433, -0.2508]} icon={phoneIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Service Center</p>
                <p className="text-gray-600">Tema, Ghana</p>
              </div>
            </Popup>
          </Marker>

          <Marker position={[6.6945, -0.1876]} icon={phoneIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Distribution Point</p>
                <p className="text-gray-600">Nsawam, Ghana</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* GPS Stats and Map Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPS Stats */}
        {currentLocation && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-blue-200 p-4">
              <p className="text-sm font-medium text-blue-600">Speed</p>
              <p className="text-2xl font-bold text-blue-700 mt-2">{speed}</p>
              <p className="text-xs text-blue-600 mt-1">km/h</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-purple-200 p-4">
              <p className="text-sm font-medium text-purple-600">Accuracy</p>
              <p className="text-2xl font-bold text-purple-700 mt-2">±{accuracy}</p>
              <p className="text-xs text-purple-600 mt-1">meters</p>
            </div>
          </>
        )}

        {/* Fleet Stats */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">In Transit</p>
          <p className="text-2xl font-bold text-green-600 mt-2">8</p>
        </div>
        {!currentLocation && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Parked</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">4</p>
          </div>
        )}
      </div>

      {/* Tracking Info */}
      {tracking && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border-2 border-green-300 p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="font-bold text-green-700">Live Tracking Active</p>
              <p className="text-sm text-green-600">Your location is being tracked in real-time. Showing {locationHistory.length} position history points.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
