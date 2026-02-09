const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const apiCall = async (url, options = {}) => {
  const headers = { ...getAuthHeaders(), ...options.headers };
  
  // Only add Content-Type if not FormData (FormData sets its own boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  if (response.status === 204) {
    return { success: true };
  }
  
  return response.json();
};

export const api = {
  // Vehicles
  getVehicles: () => apiCall(`${API_BASE_URL}/vehicles`),
  getVehicle: (id) => apiCall(`${API_BASE_URL}/vehicles/${id}`),
  createVehicle: (data) => apiCall(`${API_BASE_URL}/vehicles`, { 
    method: 'POST', 
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  updateVehicle: (id, data) => apiCall(`${API_BASE_URL}/vehicles/${id}`, { 
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  deleteVehicle: (id) => apiCall(`${API_BASE_URL}/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getDrivers: () => apiCall(`${API_BASE_URL}/drivers`),
  getDriver: (id) => apiCall(`${API_BASE_URL}/drivers/${id}`),
  createDriver: (data) => apiCall(`${API_BASE_URL}/drivers`, { 
    method: 'POST', 
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  updateDriver: (id, data) => apiCall(`${API_BASE_URL}/drivers/${id}`, { 
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  deleteDriver: (id) => apiCall(`${API_BASE_URL}/drivers/${id}`, { method: 'DELETE' }),

  // Trips
  getTrips: () => apiCall(`${API_BASE_URL}/trips`),
  getTrip: (id) => apiCall(`${API_BASE_URL}/trips/${id}`),
  createTrip: (data) => apiCall(`${API_BASE_URL}/trips`, { method: 'POST', body: JSON.stringify(data) }),
  updateTrip: (id, data) => apiCall(`${API_BASE_URL}/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrip: (id) => apiCall(`${API_BASE_URL}/trips/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => apiCall(`${API_BASE_URL}/services`),
  getService: (id) => apiCall(`${API_BASE_URL}/services/${id}`),
  createService: (data) => apiCall(`${API_BASE_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => apiCall(`${API_BASE_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => apiCall(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }),

  // Inspections
  getInspections: () => apiCall(`${API_BASE_URL}/inspections`),
  getInspection: (id) => apiCall(`${API_BASE_URL}/inspections/${id}`),
  createInspection: (data) => apiCall(`${API_BASE_URL}/inspections`, { method: 'POST', body: JSON.stringify(data) }),
  updateInspection: (id, data) => apiCall(`${API_BASE_URL}/inspections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInspection: (id) => apiCall(`${API_BASE_URL}/inspections/${id}`, { method: 'DELETE' }),

  // Issues
  getIssues: () => apiCall(`${API_BASE_URL}/issues`),
  getIssue: (id) => apiCall(`${API_BASE_URL}/issues/${id}`),
  createIssue: (data) => apiCall(`${API_BASE_URL}/issues`, { method: 'POST', body: JSON.stringify(data) }),
  updateIssue: (id, data) => apiCall(`${API_BASE_URL}/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteIssue: (id) => apiCall(`${API_BASE_URL}/issues/${id}`, { method: 'DELETE' }),

  // Expenses
  getExpenses: () => apiCall(`${API_BASE_URL}/expenses`),
  getExpense: (id) => apiCall(`${API_BASE_URL}/expenses/${id}`),
  createExpense: (data) => apiCall(`${API_BASE_URL}/expenses`, { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => apiCall(`${API_BASE_URL}/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => apiCall(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE' }),

  // Fuel Fillups
  getFuelFillups: () => apiCall(`${API_BASE_URL}/fuel-fillups`),
  getFuelFillup: (id) => apiCall(`${API_BASE_URL}/fuel-fillups/${id}`),
  createFuelFillup: (data) => apiCall(`${API_BASE_URL}/fuel-fillups`, { method: 'POST', body: JSON.stringify(data) }),
  updateFuelFillup: (id, data) => apiCall(`${API_BASE_URL}/fuel-fillups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFuelFillup: (id) => apiCall(`${API_BASE_URL}/fuel-fillups/${id}`, { method: 'DELETE' }),

  // Reminders
  getReminders: () => apiCall(`${API_BASE_URL}/reminders`),
  getReminder: (id) => apiCall(`${API_BASE_URL}/reminders/${id}`),
  createReminder: (data) => apiCall(`${API_BASE_URL}/reminders`, { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => apiCall(`${API_BASE_URL}/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReminder: (id) => apiCall(`${API_BASE_URL}/reminders/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: () => apiCall(`${API_BASE_URL}/dashboard`),
  getVehicleLocations: () => apiCall(`${API_BASE_URL}/vehicle-locations`),
  getChartData: () => apiCall(`${API_BASE_URL}/dashboard/info/chart-data`),

  // Phone Tracker
  updateTrackerLocation: (data) => apiCall(`${API_BASE_URL}/tracker/update-location`, { method: 'POST', body: JSON.stringify(data) }),
  getLastTrackerLocation: (vehicleId) => apiCall(`${API_BASE_URL}/tracker/last-location/${vehicleId}`),
  simulateTrackerUpdate: (vehicleId) => apiCall(`${API_BASE_URL}/tracker/simulate/${vehicleId}`, { method: 'POST' }),

  // Notifications
  getNotifications: () => apiCall(`${API_BASE_URL}/notifications`),
  markNotificationAsRead: (id) => apiCall(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsAsRead: () => apiCall(`${API_BASE_URL}/notifications/mark-all-read`, { method: 'PATCH' }),

  // Profile
  getProfile: () => apiCall(`${API_BASE_URL}/profile`),
  updateProfile: (data) => apiCall(`${API_BASE_URL}/profile`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProfile: () => apiCall(`${API_BASE_URL}/profile`, { method: 'DELETE' }),
};

export default api;
