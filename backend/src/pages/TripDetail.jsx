import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function TripDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    try {
      const tripData = await api.getTrip(id);
      setTrip(tripData);
      if (tripData.vehicle_id) {
        const vehicleData = await api.getVehicle(tripData.vehicle_id);
        setVehicle(vehicleData);
      }
      if (tripData.driver_id) {
        const driverData = await api.getDriver(tripData.driver_id);
        setDriver(driverData);
      }
    } catch (err) {
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await api.deleteTrip(id);
        navigate('/trips');
      } catch (err) {
        setError('Failed to delete trip');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!trip) return <div className="text-center py-12 text-red-600">Trip not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      planned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/trips')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Trips
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Details</h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trip.status)}`}>
              {trip.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/trips/${id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
            <p className="text-lg text-gray-900">
              {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})` : 'N/A'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Driver</h3>
            <p className="text-lg text-gray-900">{driver?.name || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Location</h3>
            <p className="text-lg text-gray-900">{trip.start_location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">End Location</h3>
            <p className="text-lg text-gray-900">{trip.end_location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Distance</h3>
            <p className="text-lg text-gray-900">{trip.distance} km</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Trip Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(trip.trip_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
