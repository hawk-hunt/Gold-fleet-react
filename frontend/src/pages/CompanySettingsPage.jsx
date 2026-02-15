import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CompanySettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_city: '',
    company_state: '',
    company_zip: '',
    company_country: '',
    company_registration_number: '',
    company_tax_id: '',
    company_website: ''
  });

  useEffect(() => {
    fetchCompanySettings();
    fetchTeamMembers();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/company-settings', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          ...data.data
        }));
      }
    } catch (err) {
      console.error('Error fetching company settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/team-members', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('http://localhost:8000/api/company-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update company settings');
        return;
      }

      setSuccess('Company settings updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('An error occurred while updating settings');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newMemberEmail) {
      setError('Please enter an email address');
      return;
    }

    setAddingMember(true);

    try {
      const response = await fetch('http://localhost:8000/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ email: newMemberEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to add team member');
        return;
      }

      setSuccess('Team member added successfully!');
      setNewMemberEmail('');
      setShowAddMember(false);
      fetchTeamMembers();
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('An error occurred while adding team member');
      console.error('Error:', err);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/team-members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to remove team member');
        return;
      }

      setSuccess('Team member removed successfully!');
      fetchTeamMembers();
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('An error occurred while removing team member');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Settings</h1>
        <p className="text-gray-600 mb-6">Manage your company information, preferences, and team members</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  id="company_email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  id="company_phone"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company_website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="company_website"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="company_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company_city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="company_city"
                    name="company_city"
                    value={formData.company_city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="company_state" className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="company_state"
                    name="company_state"
                    value={formData.company_state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company_zip" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    id="company_zip"
                    name="company_zip"
                    value={formData.company_zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="company_country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="company_country"
                    name="company_country"
                    value={formData.company_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company_registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="company_registration_number"
                  name="company_registration_number"
                  value={formData.company_registration_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company_tax_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  id="company_tax_id"
                  name="company_tax_id"
                  value={formData.company_tax_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Settings Button */}
          <div className="border-t border-gray-200 pt-6 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/main')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Team Members Section */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Members & Admins</h2>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {showAddMember ? 'Cancel' : 'Add Team Member'}
            </button>
          </div>

          {/* Add Team Member Form */}
          {showAddMember && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label htmlFor="member_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="member_email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter email address of the team member"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    The person will be invited to join your company and will have admin access to this system.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {addingMember ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          )}

          {/* Team Members List */}
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 text-sm">No team members added yet.</p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=FBBF24&color=fff`}
                      alt={member.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                      {member.id === user?.id && (
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          You (Owner)
                        </span>
                      )}
                    </div>
                  </div>
                  {member.id !== user?.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
