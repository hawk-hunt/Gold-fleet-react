import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      const data = await api.getVehicle(id);
      setVehicle(data.data || data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load vehicle: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.deleteVehicle(id);
        navigate('/vehicles');
      } catch (err) {
        setError('Failed to delete vehicle: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h1>
        <div className="space-x-2">
          <Link
            to={`/vehicles/${id}/edit`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 inline-block"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image */}
          <div>
            {vehicle.image_url ? (
              <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-64 object-cover rounded-lg border border-gray-300" />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">License Plate</p>
                <p className="text-lg font-semibold text-gray-900">{vehicle.license_plate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : vehicle.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {vehicle.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-lg font-semibold text-gray-900">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="text-lg font-semibold text-gray-900">{(vehicle.mileage || 0).toLocaleString()} miles</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Make/Model</p>
              <p className="text-lg font-semibold text-gray-900">{vehicle.make} {vehicle.model}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
