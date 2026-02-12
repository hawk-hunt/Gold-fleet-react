import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function FuelFillupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fuelFillup, setFuelFillup] = useState(null);
  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFuelFillupData();
  }, [id]);

  const fetchFuelFillupData = async () => {
    try {
      const response = await api.getFuelFillup(id);
      const data = response.data || response;
      setFuelFillup(data);

      if (data.vehicle_id) {
        const vehicleResponse = await api.getVehicle(data.vehicle_id);
        const vehicleData = vehicleResponse.data || vehicleResponse;
        setVehicle(vehicleData);
      } else if (data.vehicle) {
        setVehicle(data.vehicle);
      }

      // Driver may be included as nested object or id
      if (data.driver_id) {
        const driverResponse = await api.getDriver(data.driver_id);
        const driverData = driverResponse.data || driverResponse;
        setDriver(driverData);
      } else if (data.driver) {
        setDriver(data.driver);
      }
    } catch (err) {
      setError('Failed to load fuel fillup details: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this fuel fillup?')) {
      try {
        await api.deleteFuelFillup(id);
        navigate('/fuel-fillups');
      } catch (err) {
        setError('Failed to delete fuel fillup');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!fuelFillup) return <div className="text-center py-12 text-red-600">Fuel fillup not found</div>;

  const costPerGallon = fuelFillup && fuelFillup.gallons ? (parseFloat(fuelFillup.cost || 0) / parseFloat(fuelFillup.gallons)).toFixed(2) : '0.00';

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        onClick={() => navigate('/fuel-fillups')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Fuel Fillups
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">Fuel Fillup Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/fuel-fillups/${id}/edit`)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
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
            <h3 className="text-sm font-medium text-gray-500">Driver</h3>
            <p className="text-lg text-gray-900">{driver?.user?.name || driver?.name || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Fillup Date</h3>
            <p className="text-lg text-gray-900">
              {new Date(fuelFillup.fillup_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Gallons</h3>
            <p className="text-lg text-gray-900">{parseFloat(fuelFillup.gallons).toFixed(2)} gal</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Cost</h3>
            <p className="text-lg text-gray-900">{formatCurrency(fuelFillup.cost)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Cost Per Gallon</h3>
            <p className="text-lg text-gray-900">{formatCurrency(costPerGallon)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Odometer Reading</h3>
            <p className="text-lg text-gray-900">{fuelFillup.odometer_reading} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}
