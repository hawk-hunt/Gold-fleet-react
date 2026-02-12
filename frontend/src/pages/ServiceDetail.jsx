import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Details</h1>
          <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(service.status)}`}>
            {service.status?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/services/${id}/edit`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Information Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Service Type</p>
              <p className="text-lg text-gray-900 mt-1">
                {service.service_type?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Service Date</p>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(service.service_date).toLocaleDateString()}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Cost</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(service.cost)}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Make & Model</p>
              <p className="text-lg text-gray-900 mt-1">
                {vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A'}
              </p>
            </div>
            {vehicle?.license_plate && (
              <div>
                <p className="text-sm font-medium text-gray-600">License Plate</p>
                <p className="text-lg text-gray-900 mt-1 font-mono">{vehicle.license_plate}</p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {vehicle?.status ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1) : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {service.notes && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{service.notes}</p>
        </div>
      )}
    </div>
  );
}
