import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function IssueDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  const fetchIssueData = async () => {
    try {
      const response = await api.getIssue(id);
      const data = response.data || response;
      setIssue(data);

      // Try vehicle_id first (simple id), otherwise use related vehicle object
      if (data.vehicle_id) {
        const vehicleResponse = await api.getVehicle(data.vehicle_id);
        const vehicleData = vehicleResponse.data || vehicleResponse;
        setVehicle(vehicleData);
      } else if (data.vehicle) {
        setVehicle(data.vehicle);
      }
    } catch (err) {
      setError('Failed to load issue details: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await api.deleteIssue(id);
        navigate('/issues');
      } catch (err) {
        setError('Failed to delete issue');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!issue) return <div className="text-center py-12 text-red-600">Issue not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-blue-100 text-blue-800',
      closed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
          <div className="flex gap-2 mt-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(issue.status)}`}>
              {issue.status?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(issue.priority)}`}>
              {issue.priority?.replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/issues')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/issues/${id}/edit`)}
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
        {/* Vehicle & Details Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicle</p>
              <p className="text-lg text-gray-900 mt-1">
                {vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A'}
              </p>
              {vehicle?.license_plate && (
                <p className="text-sm text-gray-600 mt-1 font-mono">{vehicle.license_plate}</p>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Reported Date</p>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(issue.reported_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Status & Priority Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Status</p>
              <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(issue.status)}`}>
                {issue.status?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Priority Level</p>
              <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(issue.priority)}`}>
                {issue.priority?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{issue.description || 'No description provided'}</p>
      </div>
    </div>
  );
}
