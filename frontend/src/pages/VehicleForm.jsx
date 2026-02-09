import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useFormValidation } from '../hooks/useFormValidation';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const form = useFormValidation(
    {
      name: '',
      license_plate: '',
      type: 'Car',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      status: 'active',
      fuel_capacity: '',
      fuel_type: 'gasoline',
      notes: '',
    },
    {
      name: {
        required: 'Vehicle name is required',
      },
      license_plate: {
        required: 'License plate is required',
      },
      type: {
        required: 'Vehicle type is required',
      },
      make: {
        required: 'Make is required',
      },
      model: {
        required: 'Model is required',
      },
    }
  );

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      const data = await api.getVehicle(id);
      const vehicle = data.data || data;
      Object.keys(vehicle).forEach((key) => {
        if (form.values.hasOwnProperty(key)) {
          form.setFieldValue(key, vehicle[key]);
        }
      });
      if (vehicle.image_url) {
        setPreview(vehicle.image_url);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load vehicle: ' + err.message);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('[VehicleForm] Image selected:', file.name, file.size, file.type);
      setImageFile(file);
      
      // Create object URL for instant preview
      const objectUrl = URL.createObjectURL(file);
      console.log('[VehicleForm] Preview URL created:', objectUrl);
      setPreview(objectUrl);
      
      // Also create data URL as fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('[VehicleForm] DataURL preview ready');
        setPreview(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('[VehicleForm] FileReader error:', error);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('[VehicleForm] No file selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.isValid) {
      form.setAllTouched();
      return;
    }

    // Check image for new vehicles
    if (!id && !imageFile) {
      setError('Vehicle image is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form.values).forEach((key) => {
        formData.append(key, form.values[key]);
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (id) {
        formData.append('_method', 'PUT');
        await api.updateVehicle(id, formData);
      } else {
        await api.createVehicle(formData);
      }

      navigate('/vehicles');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="space-y-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image <span className="text-red-500">*</span></label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center flex-shrink-0">
                {preview ? (
                  <img 
                    key={preview} 
                    src={preview} 
                    alt="Vehicle preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('[VehicleForm] Image load error:', e);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('[VehicleForm] Image loaded successfully');
                    }}
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">No image selected</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                />
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Vehicle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                form.errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-yellow-600'
              }`}
              placeholder="e.g., Work Truck 01"
            />
            {form.errors.name && (
              <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
            )}
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Plate <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="license_plate"
              value={form.values.license_plate}
              onChange={form.handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                form.errors.license_plate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-yellow-600'
              }`}
              placeholder="ABC-1234"
            />
            {form.errors.license_plate && (
              <p className="mt-1 text-sm text-red-600">{form.errors.license_plate}</p>
            )}
          </div>

          {/* Type & Make */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
              <select
                name="type"
                value={form.values.type}
                onChange={form.handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  form.errors.type
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-600'
                }`}
              >
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </select>
              {form.errors.type && (
                <p className="mt-1 text-sm text-red-600">{form.errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="make"
                value={form.values.make}
                onChange={form.handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  form.errors.make
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-600'
                }`}
                placeholder="Toyota"
              />
              {form.errors.make && (
                <p className="mt-1 text-sm text-red-600">{form.errors.make}</p>
              )}
            </div>
          </div>

          {/* Model & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="model"
                value={form.values.model}
                onChange={form.handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  form.errors.model
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-yellow-600'
                }`}
                placeholder="Corolla"
              />
              {form.errors.model && (
                <p className="mt-1 text-sm text-red-600">{form.errors.model}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={form.values.year}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
          </div>

          {/* VIN & Fuel Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
              <input
                type="text"
                name="vin"
                value={form.values.vin}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="VIN123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                name="fuel_type"
                value={form.values.fuel_type}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Fuel Capacity & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Capacity (gallons)</label>
              <input
                type="number"
                name="fuel_capacity"
                value={form.values.fuel_capacity}
                onChange={form.handleChange}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="15.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={form.values.status}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={form.values.notes}
              onChange={form.handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Additional notes about the vehicle..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !form.isValid}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Vehicle'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
