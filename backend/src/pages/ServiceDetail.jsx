import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    try {
      const serviceData = await api.getService(id);
      setService(serviceData);
      if (serviceData.vehicle_id) {
        const vehicleData = await api.getVehicle(serviceData.vehicle_id);
        setVehicle(vehicleData);
      }
    } catch (err) {
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteService(id);
        navigate('/services');
      } catch (err) {
        setError('Failed to delete service');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!service) return <div className="text-center py-12 text-red-600">Service not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/services')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Services
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Details</h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(service.status)}`}>
              {service.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/services/${id}/edit`)}
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
            <h3 className="text-sm font-medium text-gray-500">Service Type</h3>
            <p className="text-lg text-gray-900">
              {service.service_type?.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Service Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(service.service_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Cost</h3>
            <p className="text-lg text-gray-900">${parseFloat(service.cost || 0).toFixed(2)}</p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="text-lg text-gray-900">{service.notes || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
