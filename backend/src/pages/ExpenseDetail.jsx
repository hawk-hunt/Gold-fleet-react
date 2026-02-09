import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

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
      const expenseData = await api.getExpense(id);
      setExpense(expenseData);
      if (expenseData.vehicle_id) {
        const vehicleData = await api.getVehicle(expenseData.vehicle_id);
        setVehicle(vehicleData);
      }
    } catch (err) {
      setError('Failed to load expense details');
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
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/expenses')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Expenses
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Details</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {expense.category?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/expenses/${id}/edit`)}
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
            <h3 className="text-sm font-medium text-gray-500">Amount</h3>
            <p className="text-lg text-gray-900">${parseFloat(expense.amount || 0).toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Expense Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(expense.expense_date).toLocaleDateString()}
            </p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="text-lg text-gray-900">{expense.notes || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
