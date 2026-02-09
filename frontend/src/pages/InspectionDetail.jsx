import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function InspectionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInspectionData();
  }, [id]);

  const fetchInspectionData = async () => {
    try {
      const response = await api.getInspection(id);
      setInspection(response.data || response);
    } catch (err) {
      setError('Failed to load inspection details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      try {
        await api.deleteInspection(id);
        navigate('/inspections');
      } catch (err) {
        setError('Failed to delete inspection');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!inspection) return <div className="text-center py-12 text-red-600">Inspection not found</div>;

  const getResultColor = (result) => {
    const colors = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      conditional_pass: 'bg-yellow-100 text-yellow-800',
    };
    return colors[result] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspection Details</h1>
          <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${getResultColor(inspection.result)}`}>
            {inspection.result?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/inspections')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/inspections/${id}/edit`)}
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
        {/* Vehicle Information Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Make & Model</p>
              <p className="text-lg text-gray-900 mt-1">
                {inspection.vehicle ? `${inspection.vehicle.make} ${inspection.vehicle.model}` : 'N/A'}
              </p>
            </div>
            {inspection.vehicle?.license_plate && (
              <div>
                <p className="text-sm font-medium text-gray-600">License Plate</p>
                <p className="text-lg text-gray-900 mt-1 font-mono">{inspection.vehicle.license_plate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver Information Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Driver Name</p>
              <p className="text-lg text-gray-900 mt-1">{inspection.driver?.user?.name || inspection.driver?.name || 'N/A'}</p>
            </div>
            {inspection.driver?.user?.email && (
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg text-gray-900 mt-1">{inspection.driver.user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Schedule Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspection Schedule</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Inspection Date</p>
              <p className="text-lg text-gray-900 mt-1">
                {inspection.inspection_date ? new Date(inspection.inspection_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Next Due Date</p>
              <p className="text-lg text-gray-900 mt-1">
                {inspection.next_due_date ? new Date(inspection.next_due_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Inspection Result Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Result</h2>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getResultColor(inspection.result)}`}>
              {inspection.result?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
            {inspection.result === 'pass' && (
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {inspection.result === 'fail' && (
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {inspection.notes && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
        </div>
      )}
    </div>
  );
}
