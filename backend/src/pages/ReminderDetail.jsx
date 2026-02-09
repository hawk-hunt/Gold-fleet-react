import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function ReminderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reminder, setReminder] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReminderData();
  }, [id]);

  const fetchReminderData = async () => {
    try {
      const reminderData = await api.getReminder(id);
      setReminder(reminderData);
      if (reminderData.vehicle_id) {
        const vehicleData = await api.getVehicle(reminderData.vehicle_id);
        setVehicle(vehicleData);
      }
    } catch (err) {
      setError('Failed to load reminder details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await api.deleteReminder(id);
        navigate('/reminders');
      } catch (err) {
        setError('Failed to delete reminder');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!reminder) return <div className="text-center py-12 text-red-600">Reminder not found</div>;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/reminders')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Reminders
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{reminder.title}</h1>
            <div className="flex gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reminder.status)}`}>
                {reminder.status?.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(reminder.priority)}`}>
                {reminder.priority?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/reminders/${id}/edit`)}
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
            <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(reminder.due_date).toLocaleDateString()}
            </p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-lg text-gray-900">{reminder.description || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
