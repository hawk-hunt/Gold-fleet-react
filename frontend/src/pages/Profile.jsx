import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await api.getProfile();
      const data = resp.data || resp;
      setProfile(data);
      setForm({
        name: data.name || data.user?.name || '',
        email: data.email || data.user?.email || '',
        phone: data.phone || data.user?.phone || '',
      });
    } catch (err) {
      setError('Failed to load profile: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const resp = await api.updateProfile(form);
      const data = resp.data || resp;
      setProfile(data);
      setEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile: ' + (err.message || err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your profile? This cannot be undone.')) return;
    try {
      await api.deleteProfile();
      // clear auth and redirect to login
      sessionStorage.removeItem('auth_token');
      navigate('/login');
    } catch (err) {
      setError('Failed to delete profile: ' + (err.message || err));
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="flex gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Edit
              </button>
            )}
            {editing && (
              <button
                onClick={() => { setEditing(false); setForm({ name: profile.name || profile.user?.name || '', email: profile.email || profile.user?.email || '', phone: profile.phone || profile.user?.phone || '' }); setError(''); setSuccess(''); }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
        {success && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">{success}</div>}

        {!editing ? (
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm text-gray-500">Name</h3>
              <p className="text-lg text-gray-900">{profile.name || profile.user?.name || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Email</h3>
              <p className="text-lg text-gray-900">{profile.email || profile.user?.email || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Phone</h3>
              <p className="text-lg text-gray-900">{profile.phone || profile.user?.phone || '—'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} disabled className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
