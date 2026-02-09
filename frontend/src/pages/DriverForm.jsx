import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useFormValidation } from '../hooks/useFormValidation';

export default function DriverForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const form = useFormValidation(
    {
      name: '',
      email: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      status: 'active',
      vehicle_id: '',
      address: '',
    },
    {
      name: {
        required: 'Driver name is required',
      },
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
      },
      license_number: {
        required: 'License number is required',
      },
      license_expiry: {
        required: 'License expiry date is required',
      },
      status: {
        required: 'Status is required',
      },
    }
  );

  useEffect(() => {
    if (id) {
      loadDriver();
    }
  }, [id]);

  const loadDriver = async () => {
    try {
      const data = await api.getDriver(id);
      const driver = data.data || data;
      
      // Set form fields
      Object.keys(driver).forEach((key) => {
        if (form.values.hasOwnProperty(key)) {
          form.setFieldValue(key, driver[key]);
        }
      });
      
      // Set image preview if exists
      if (driver.image_url) {
        console.log('[DriverForm] Loading image:', driver.image_url);
        setPreview(driver.image_url);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load driver: ' + err.message);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('[DriverForm] Image selected:', file.name);
      setImageFile(file);
      // Create and set preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('[DriverForm] Preview ready');
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DriverForm] Submit clicked');
    console.log('[DriverForm] Form is valid:', form.isValid);
    console.log('[DriverForm] Form values:', form.values);
    console.log('[DriverForm] Form errors:', form.errors);

    // Validate form
    if (!form.isValid) {
      console.log('[DriverForm] Form validation failed, marking all touched');
      form.setAllTouched();
      return;
    }

    // Check image for new drivers
    if (!id && !imageFile) {
      console.log('[DriverForm] New driver but no image provided');
      setError('Driver image is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form.values).forEach((key) => {
        formData.append(key, form.values[key]);
      });

      // Add image if selected
      if (imageFile) {
        console.log('[DriverForm] Adding image file:', imageFile.name);
        formData.append('image', imageFile);
      }

      if (id) {
        console.log('[DriverForm] Updating driver ID:', id);
        formData.append('_method', 'PUT');
        await api.updateDriver(id, formData);
      } else {
        console.log('[DriverForm] Creating new driver');
        await api.createDriver(formData);
      }

      console.log('[DriverForm] Save successful, navigating to /drivers');
      navigate('/drivers');
    } catch (err) {
      console.error('[DriverForm] Save error:', err);
      setError(err.message || 'Failed to save driver');
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
        <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Driver' : 'Add New Driver'}</h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver Photo</label>
            <div className="flex gap-4">
              {preview && (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-300" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
              />
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone & License */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                name="phone"
                value={form.values.phone}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                name="license_number"
                value={form.values.license_number}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="DL-12345678"
              />
            </div>
          </div>

          {/* License Expiry & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry *</label>
              <input
                type="date"
                name="license_expiry"
                value={form.values.license_expiry}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={form.values.status}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Phone & License Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={form.values.phone}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
              <input
                type="text"
                name="license_number"
                value={form.values.license_number}
                onChange={form.handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="DL-12345678"
              />
            </div>
          </div>

          {/* Vehicle & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Vehicle</label>
              <select
                name="vehicle_id"
                value={form.values.vehicle_id}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <option value="">None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={form.values.address}
                onChange={form.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="123 Main St"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Driver'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/drivers')}
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
