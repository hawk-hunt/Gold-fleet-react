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
      const issueData = await api.getIssue(id);
      setIssue(issueData);
      if (issueData.vehicle_id) {
        const vehicleData = await api.getVehicle(issueData.vehicle_id);
        setVehicle(vehicleData);
      }
    } catch (err) {
      setError('Failed to load issue details');
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
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/issues')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Issues
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
            <div className="flex gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(issue.status)}`}>
                {issue.status?.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(issue.priority)}`}>
                {issue.priority?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/issues/${id}/edit`)}
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
            <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(issue.reported_date).toLocaleDateString()}
            </p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-lg text-gray-900">{issue.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
