import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function PhoneTracker() {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locations, setLocations] = useState([]);
  const [speed, setSpeed] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Start tracking phone location
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('');
    setSuccess('Starting GPS tracking...');
    setTracking(true);

    // Watch position for continuous tracking
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed } = position.coords;
        const timestamp = new Date().toLocaleTimeString();

        const newLocation = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          speed: speed ? Math.round(speed * 3.6) : 0, // Convert m/s to km/h
          timestamp,
        };

        setLocation(newLocation);
        setAccuracy(Math.round(accuracy));
        setSpeed(speed ? Math.round(speed * 3.6) : 0);

        // Add to history
        setLocations((prev) => [newLocation, ...prev.slice(0, 9)]);
        setSuccess(`Location updated at ${timestamp}`);
        setError('');
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    setTracking(false);
    setSuccess('Tracking stopped');
  };

  // Send location to backend
  const sendLocationToBackend = async () => {
    if (!location) {
      setError('No location data available');
      return;
    }

    try {
      const response = await api.post('/vehicle-locations', {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        speed: location.speed,
        location_description: `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`,
      });

      setSuccess('Location sent to backend successfully!');
      setError('');
    } catch (err) {
      setError('Failed to send location: ' + (err.message || 'Unknown error'));
    }
  };

  // Get current location once
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('');
    setSuccess('Getting location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed } = position.coords;
        const timestamp = new Date().toLocaleTimeString();

        const newLocation = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          speed: speed ? Math.round(speed * 3.6) : 0,
          timestamp,
        };

        setLocation(newLocation);
        setAccuracy(Math.round(accuracy));
        setSpeed(speed ? Math.round(speed * 3.6) : 0);
        setSuccess(`Location captured at ${timestamp}`);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-900">📱 Phone GPS Tracker</h1>
        <p className="mt-2 text-gray-600">Track your phone's location in real-time</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={getCurrentLocation}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          📍 Get Current Location
        </button>

        {!tracking ? (
          <button
            onClick={startTracking}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ▶️ Start Continuous Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ⏹️ Stop Tracking
          </button>
        )}

        <button
          onClick={sendLocationToBackend}
          disabled={!location}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          📤 Send to Backend
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          ← Back
        </button>
      </div>

      {/* Current Location Display */}
      {location && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Info Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Current Location</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Latitude</p>
                <p className="text-lg text-gray-900 font-mono">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Longitude</p>
                <p className="text-lg text-gray-900 font-mono">{location.longitude.toFixed(6)}</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg text-gray-900">{location.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 GPS Stats</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-lg text-gray-900 font-mono">{accuracy} meters</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Speed</p>
                <p className="text-lg text-green-600 font-mono font-bold">{speed} km/h</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600">Tracking Status</p>
                <p className={`text-lg font-semibold ${tracking ? 'text-green-600' : 'text-gray-600'}`}>
                  {tracking ? '🔴 LIVE' : '⚪ Idle'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location History */}
      {locations.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📜 Location History (Last 10)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border border-gray-200 rounded-lg">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Latitude</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Longitude</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Speed (km/h)</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Accuracy (m)</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{loc.timestamp}</td>
                    <td className="px-4 py-2 font-mono text-gray-900">{loc.latitude.toFixed(4)}</td>
                    <td className="px-4 py-2 font-mono text-gray-900">{loc.longitude.toFixed(4)}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">{loc.speed}</td>
                    <td className="px-4 py-2 text-gray-600">{loc.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Google Maps Link */}
      {location && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-700 mb-3">🗺️ Open in Google Maps:</p>
          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            https://maps.google.com/?q={location.latitude.toFixed(6)},{location.longitude.toFixed(6)}
          </a>
        </div>
      )}
    </div>
  );
}
