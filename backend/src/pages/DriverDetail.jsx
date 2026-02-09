import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDriver();
  }, [id]);

  const loadDriver = async () => {
    try {
      const data = await api.getDriver(id);
      setDriver(data.data || data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load driver: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.deleteDriver(id);
        navigate('/drivers');
      } catch (err) {
        setError('Failed to delete driver: ' + err.message);
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

  if (!driver) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Driver not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{driver.name}</h1>
        <div className="space-x-2">
          <Link
            to={`/drivers/${id}/edit`}
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
            onClick={() => navigate('/drivers')}
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
          {/* Photo */}
          <div>
            {driver.image_url ? (
              <img src={driver.image_url} alt={driver.name} className="w-full h-64 object-cover rounded-lg border border-gray-300" />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No photo
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">{driver.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{driver.phone || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="text-lg font-semibold text-gray-900">{driver.license_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Expiry</p>
                <p className="text-lg font-semibold text-gray-900">{driver.license_expiry || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                driver.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : driver.status === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {driver.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
