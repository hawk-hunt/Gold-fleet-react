import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function FuelFillups() {
  const [fillups, setFillups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFillups();
  }, []);

  const loadFillups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getFuelFillups();
      setFillups(data.data || []);
    } catch (err) {
      setError('Failed to load fuel fillups: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fuel fillup?')) {
      try {
        await api.deleteFuelFillup(id);
        setFillups(fillups.filter(f => f.id !== id));
      } catch (err) {
        setError('Failed to delete fuel fillup: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fuel Fillups</h1>
        <Link
          to="/fuel-fillups/create"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          + New Fillup
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading fuel fillups...</p>
        </div>
      ) : fillups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No fuel fillups found. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gallons</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cost</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fillups.map((fillup) => (
                <tr key={fillup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{fillup.vehicle?.license_plate || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{fillup.fillup_date || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{fillup.gallons || '-'} gal</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${fillup.cost || '-'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link
                      to={`/fuel-fillups/${fillup.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link
                      to={`/fuel-fillups/${fillup.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(fillup.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
