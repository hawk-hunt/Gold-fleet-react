import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function ExpenseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenseData();
  }, [id]);

  const fetchExpenseData = async () => {
    try {
      const response = await api.getExpense(id);
      const data = response.data || response;
      setExpense(data);

      if (data.vehicle_id) {
        const vehicleResponse = await api.getVehicle(data.vehicle_id);
        const vehicleData = vehicleResponse.data || vehicleResponse;
        setVehicle(vehicleData);
      } else if (data.vehicle) {
        setVehicle(data.vehicle);
      }
    } catch (err) {
      setError('Failed to load expense details: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(id);
        navigate('/expenses');
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!expense) return <div className="text-center py-12 text-red-600">Expense not found</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Details</h1>
          <span className="inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            {expense.category?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/expenses/${id}/edit`)}
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
        {/* Amount & Category Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-lg text-gray-900 mt-1">
                {expense.category?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600">Amount</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(expense.amount)}</p>
            </div>
          </div>
        </div>

        {/* Vehicle & Date Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h2>
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
              <p className="text-sm font-medium text-gray-600">Expense Date</p>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(expense.expense_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      {expense.notes && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{expense.notes}</p>
        </div>
      )}
    </div>
  );
}
