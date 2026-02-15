import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MapDashboard from './pages/MapDashboard';
import InfoDashboard from './pages/InfoDashboard';
import Vehicles from './pages/Vehicles';
import VehicleForm from './pages/VehicleForm';
import VehicleDetail from './pages/VehicleDetail';
import Drivers from './pages/Drivers';
import DriverForm from './pages/DriverForm';
import DriverDetail from './pages/DriverDetail';
import Trips from './pages/Trips';
import TripForm from './pages/TripForm';
import TripDetail from './pages/TripDetail';
import Services from './pages/Services';
import ServiceForm from './pages/ServiceForm';
import ServiceDetail from './pages/ServiceDetail';
import Inspections from './pages/Inspections';
import InspectionForm from './pages/InspectionForm';
import InspectionDetail from './pages/InspectionDetail';
import Issues from './pages/Issues';
import IssueForm from './pages/IssueForm';
import IssueDetail from './pages/IssueDetail';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseDetail from './pages/ExpenseDetail';
import FuelFillups from './pages/FuelFillups';
import FuelFillupForm from './pages/FuelFillupForm';
import FuelFillupDetail from './pages/FuelFillupDetail';
import Reminders from './pages/Reminders';
import ReminderForm from './pages/ReminderForm';
import ReminderDetail from './pages/ReminderDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import ChangePasswordPage from './pages/ChangePasswordPage';
import CompanySettingsPage from './pages/CompanySettingsPage';
import './App.css';

// Debug page to clear auth
function LogoutPage() {
  React.useEffect(() => {
    sessionStorage.removeItem('auth_token')
    sessionStorage.clear()
    window.location.href = '/'
  }, [])
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <p className="text-gray-700 mb-4">Logging out...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const ProtectedLayout = ({ children }) => (
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/email/verify" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      
      {/* Dashboard */}
      <Route path="/main" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/map" element={<ProtectedLayout><MapDashboard /></ProtectedLayout>} />
      <Route path="/info" element={<ProtectedLayout><InfoDashboard /></ProtectedLayout>} />
      
      {/* Fleet Management - Vehicles */}
      <Route path="/vehicles" element={<ProtectedLayout><Vehicles /></ProtectedLayout>} />
      <Route path="/vehicles/create" element={<ProtectedLayout><VehicleForm /></ProtectedLayout>} />
      <Route path="/vehicles/:id" element={<ProtectedLayout><VehicleDetail /></ProtectedLayout>} />
      <Route path="/vehicles/:id/edit" element={<ProtectedLayout><VehicleForm /></ProtectedLayout>} />
      
      {/* Fleet Management - Drivers */}
      <Route path="/drivers" element={<ProtectedLayout><Drivers /></ProtectedLayout>} />
      <Route path="/drivers/create" element={<ProtectedLayout><DriverForm /></ProtectedLayout>} />
      <Route path="/drivers/:id" element={<ProtectedLayout><DriverDetail /></ProtectedLayout>} />
      <Route path="/drivers/:id/edit" element={<ProtectedLayout><DriverForm /></ProtectedLayout>} />
      
      {/* Fleet Management - Trips */}
      <Route path="/trips" element={<ProtectedLayout><Trips /></ProtectedLayout>} />
      <Route path="/trips/create" element={<ProtectedLayout><TripForm /></ProtectedLayout>} />
      <Route path="/trips/:id" element={<ProtectedLayout><TripDetail /></ProtectedLayout>} />
      <Route path="/trips/:id/edit" element={<ProtectedLayout><TripForm /></ProtectedLayout>} />
      
      {/* Maintenance - Services */}
      <Route path="/services" element={<ProtectedLayout><Services /></ProtectedLayout>} />
      <Route path="/services/create" element={<ProtectedLayout><ServiceForm /></ProtectedLayout>} />
      <Route path="/services/:id" element={<ProtectedLayout><ServiceDetail /></ProtectedLayout>} />
      <Route path="/services/:id/edit" element={<ProtectedLayout><ServiceForm /></ProtectedLayout>} />
      
      {/* Maintenance - Inspections */}
      <Route path="/inspections" element={<ProtectedLayout><Inspections /></ProtectedLayout>} />
      <Route path="/inspections/create" element={<ProtectedLayout><InspectionForm /></ProtectedLayout>} />
      <Route path="/inspections/:id" element={<ProtectedLayout><InspectionDetail /></ProtectedLayout>} />
      <Route path="/inspections/:id/edit" element={<ProtectedLayout><InspectionForm /></ProtectedLayout>} />
      
      {/* Maintenance - Issues */}
      <Route path="/issues" element={<ProtectedLayout><Issues /></ProtectedLayout>} />
      <Route path="/issues/create" element={<ProtectedLayout><IssueForm /></ProtectedLayout>} />
      <Route path="/issues/:id" element={<ProtectedLayout><IssueDetail /></ProtectedLayout>} />
      <Route path="/issues/:id/edit" element={<ProtectedLayout><IssueForm /></ProtectedLayout>} />
      
      {/* Financial - Expenses */}
      <Route path="/expenses" element={<ProtectedLayout><Expenses /></ProtectedLayout>} />
      <Route path="/expenses/create" element={<ProtectedLayout><ExpenseForm /></ProtectedLayout>} />
      <Route path="/expenses/:id" element={<ProtectedLayout><ExpenseDetail /></ProtectedLayout>} />
      <Route path="/expenses/:id/edit" element={<ProtectedLayout><ExpenseForm /></ProtectedLayout>} />
      
      {/* Financial - Fuel Fillups */}
      <Route path="/fuel-fillups" element={<ProtectedLayout><FuelFillups /></ProtectedLayout>} />
      <Route path="/fuel-fillups/create" element={<ProtectedLayout><FuelFillupForm /></ProtectedLayout>} />
      <Route path="/fuel-fillups/:id" element={<ProtectedLayout><FuelFillupDetail /></ProtectedLayout>} />
      <Route path="/fuel-fillups/:id/edit" element={<ProtectedLayout><FuelFillupForm /></ProtectedLayout>} />
      
      {/* Planning - Reminders */}
      <Route path="/reminders" element={<ProtectedLayout><Reminders /></ProtectedLayout>} />
      <Route path="/reminders/create" element={<ProtectedLayout><ReminderForm /></ProtectedLayout>} />
      <Route path="/reminders/:id" element={<ProtectedLayout><ReminderDetail /></ProtectedLayout>} />
      <Route path="/reminders/:id/edit" element={<ProtectedLayout><ReminderForm /></ProtectedLayout>} />
      
      {/* Profile & Notifications */}
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
      <Route path="/change-password" element={<ProtectedLayout><ChangePasswordPage /></ProtectedLayout>} />
      <Route path="/company-settings" element={<ProtectedLayout><CompanySettingsPage /></ProtectedLayout>} />
      <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
