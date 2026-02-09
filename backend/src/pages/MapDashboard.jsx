import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ChartComponent from '../components/ChartComponent';
import { api } from '../services/api';

// Custom marker icons
const getMarkerIcon = (status) => {
  const color = status === 'moving' ? 'green' : status === 'stopped' ? 'yellow' : 'red';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color === 'green' ? '#10b981' : color === 'yellow' ? '#eab308' : '#ef4444'}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">●</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Skeleton Loader
function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
        ))}
      </div>
      {/* Map Skeleton */}
      <div className="bg-gray-200 rounded-lg h-96"></div>
      {/* List Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    </div>
  );
}

export default function MapDashboard() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const locData = await api.getVehicleLocations();
      setLocations(Array.isArray(locData) ? locData : []);
    } catch (err) {
      console.error('Failed to load map data', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate phone tracker update
  const simulatePhoneTrackerUpdate = async () => {
    if (locations.length === 0) {
      setError('No vehicles available to track');
      return;
    }
    
    setSimulating(true);
    try {
      const vehicleId = locations[0].vehicle_id;
      await api.simulateTrackerUpdate(vehicleId);
      // Reload locations after update
      await loadLocations();
    } catch (err) {
      console.error('Failed to simulate tracker update', err);
      setError('Failed to update tracker: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadLocations();

    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadLocations, 30000);
    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const activeVehicles = locations.filter(l => l.vehicle?.status === 'active').length;
  const stoppedVehicles = locations.filter(l => !l.speed || l.speed === 0).length;
  const movingVehicles = locations.filter(l => l.speed && l.speed > 0).length;
  const alertVehicles = locations.filter(l => l.alert_status).length;

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <p>Error loading map: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Status KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm font-medium">Active Vehicles</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{activeVehicles}</div>
          <div className="mt-1 text-xs text-blue-600">On the road</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-gray-500 text-sm font-medium">Moving</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{movingVehicles}</div>
          <div className="mt-1 text-xs text-green-600">Currently in transit</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-gray-500 text-sm font-medium">Stopped</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stoppedVehicles}</div>
          <div className="mt-1 text-xs text-yellow-600">Idle or parked</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-gray-500 text-sm font-medium">Alerts</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{alertVehicles}</div>
          <div className="mt-1 text-xs text-red-600">Require attention</div>
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Tracking Map</h2>
          <button
            onClick={simulatePhoneTrackerUpdate}
            disabled={simulating || locations.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            title="Simulate phone tracker GPS update"
          >
            {simulating ? '📍 Updating...' : '📍 Simulate Tracker Update'}
          </button>
        </div>
        {locations.length > 0 ? (
          <MapContainer 
            center={[locations[0]?.latitude || 40.7128, locations[0]?.longitude || -74.0060]} 
            zoom={13} 
            style={{ height: '65vh', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {locations.map((loc) => {
              const status = loc.speed && loc.speed > 0 ? 'moving' : loc.alert_status ? 'alert' : 'stopped';
              return (
                <Marker 
                  key={loc.id} 
                  position={[loc.latitude, loc.longitude]}
                  icon={getMarkerIcon(status)}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                      <p className="text-gray-600">{loc.vehicle?.license_plate}</p>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">Status:</span> {status === 'moving' ? '🚗 Moving' : status === 'alert' ? '⚠️ Alert' : '🛑 Stopped'}</p>
                        <p><span className="font-medium">Speed:</span> {Math.round(loc.speed || 0)} mph</p>
                        <p><span className="font-medium">Last Update:</span> {loc.recorded_at ? new Date(loc.recorded_at).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="bg-gray-100 rounded-lg w-full h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No vehicle locations available</p>
          </div>
        )}
      </div>

      {/* Detailed Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stopped Vehicles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Stopped Vehicles</h2>
            <p className="text-sm text-gray-600">Currently not moving</p>
          </div>
          <div className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {locations.filter(l => !l.speed || l.speed === 0).length === 0 && (
                <p className="text-gray-500 text-center py-4">All vehicles are moving</p>
              )}
              {locations.filter(l => !l.speed || l.speed === 0).map((loc) => (
                <div key={loc.id} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{loc.vehicle?.license_plate}</p>
                    <p className="text-xs text-gray-500 mt-1">Last: {loc.recorded_at ? new Date(loc.recorded_at).toLocaleTimeString() : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Routes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Routes</h2>
            <p className="text-sm text-gray-600">Currently in transit</p>
          </div>
          <div className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {locations.filter(l => l.speed && l.speed > 0).length === 0 && (
                <p className="text-gray-500 text-center py-4">No vehicles in transit</p>
              )}
              {locations.filter(l => l.speed && l.speed > 0).map((loc) => (
                <div key={loc.id} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{loc.vehicle?.license_plate}</p>
                    <div className="flex justify-between mt-1 text-xs text-gray-600">
                      <span>Speed: {Math.round(loc.speed || 0)} mph</span>
                      <span>Lat: {loc.latitude?.toFixed(2)}, Lng: {loc.longitude?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Activity Timeline - Optimized Table */}
      {locations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Vehicle Locations</h2>
            <p className="text-sm text-gray-600">Latest position and status</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {locations.map((loc) => (
                <div key={loc.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                  <p className="text-xs text-gray-600">{loc.vehicle?.license_plate}</p>
                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={loc.speed && loc.speed > 0 ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                        {loc.speed && loc.speed > 0 ? 'Moving' : 'Stopped'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span>{Math.round(loc.speed || 0)} mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{loc.recorded_at ? new Date(loc.recorded_at).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
