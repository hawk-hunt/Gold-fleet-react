import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  BarChart3,
  Car,
  Users,
  Route,
  Wrench,
  FileText,
  Settings,
  Menu,
  Filter,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  Fuel,
  Cog,
  Receipt,
  BellRing,
  CheckCircle,
  AlertCircle,
  Truck,
  User,
  BarChart,
  LineChart,
  PieChart
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('total');

  const navigation = [
    { name: 'Dashboard', icon: BarChart3, current: true },
    { name: 'Daily Mileage', icon: Route, current: false },
    { name: 'Fill-ups', icon: Fuel, current: false },
    { name: 'Trips', icon: Route, current: false },
    { name: 'Daily Timesheet', icon: Clock, current: false },
    { name: 'Services', icon: Cog, current: false },
    { name: 'Other Expenses', icon: Receipt, current: false },
    { name: 'Reminders', icon: BellRing, current: false },
    { name: 'Vehicle Inspections', icon: CheckCircle, current: false },
    { name: 'Issues', icon: AlertCircle, current: false },
    { name: 'Work Orders', icon: Wrench, current: false },
    { name: 'Vehicles', icon: Truck, current: false },
    { name: 'Users', icon: User, current: false },
  ];

  const summaryCards = [
    { title: 'Total Cost of Ownership', value: '$125,430', icon: DollarSign, color: 'text-green-600', change: '+2.5%' },
    { title: 'Total Expense', value: '$45,230', icon: Receipt, color: 'text-blue-600', change: '+1.2%' },
    { title: 'Vehicle Downtime', value: '12 days', icon: Clock, color: 'text-red-600', change: '-5%' },
    { title: 'Overdue Reminders', value: '3', icon: BellRing, color: 'text-yellow-600', change: '0' },
    { title: 'Maintenance Count', value: '28', icon: Wrench, color: 'text-purple-600', change: '+10%' },
    { title: 'Renewal Count', value: '5', icon: AlertTriangle, color: 'text-orange-600', change: '-2' },
    { title: 'Average MPG', value: '22.5', icon: Fuel, color: 'text-indigo-600', change: '+0.5' },
    { title: 'Open Issues', value: '7', icon: AlertCircle, color: 'text-red-600', change: '-1' },
  ];

  const costData = [
    { name: 'Jan', totalCost: 12000, costPerMile: 0.45, costPerDay: 400 },
    { name: 'Feb', totalCost: 11500, costPerMile: 0.42, costPerDay: 380 },
    { name: 'Mar', totalCost: 13200, costPerMile: 0.48, costPerDay: 420 },
    { name: 'Apr', totalCost: 12800, costPerMile: 0.46, costPerDay: 410 },
    { name: 'May', totalCost: 14100, costPerMile: 0.50, costPerDay: 430 },
    { name: 'Jun', totalCost: 13800, costPerMile: 0.49, costPerDay: 425 },
  ];

  const tabs = [
    { id: 'total', label: 'Total Stats', icon: BarChart3 },
    { id: 'fuel', label: 'Fuel Stats', icon: Fuel },
    { id: 'service', label: 'Service Stats', icon: Cog },
    { id: 'other', label: 'Other Expenses Stats', icon: Receipt },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-yellow-800 to-amber-900 text-white transition-all duration-300 ease-in-out shadow-lg`}>
        <div className="flex items-center justify-between p-4 border-b border-yellow-700">
          <h1 className={`font-bold text-xl text-yellow-100 ${sidebarOpen ? 'block' : 'hidden'}`}>
            Gold Fleet
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-yellow-200 hover:bg-yellow-700 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6">
          <div className="px-3 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'text-yellow-100 hover:bg-yellow-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-lg border-b border-yellow-200">
          <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-yellow-50 to-amber-50">
            {/* Left: Logo + Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">GF</div>
                <div>
                  <div className="text-sm font-semibold text-amber-700">Gold Fleet</div>
                  <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                </div>
              </div>
            </div>

            {/* Middle: Global Filters */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="flex items-center space-x-3 w-full max-w-3xl">
                <select className="w-1/4 py-2 px-3 border border-yellow-200 rounded-lg bg-white text-gray-700">
                  <option>All Groups</option>
                  <option>Group A</option>
                </select>

                <select className="w-1/4 py-2 px-3 border border-yellow-200 rounded-lg bg-white text-gray-700">
                  <option>All Vehicles</option>
                  <option>Vehicle 1</option>
                </select>

                <button className="flex items-center w-1/3 justify-between py-2 px-3 border border-yellow-200 rounded-lg bg-white text-gray-700 hover:bg-yellow-50">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Last 30 Days</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Right: Notifications, Org Switch, Profile */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-md hover:bg-yellow-100 text-gray-700">
                <Bell className="h-5 w-5" />
              </button>

              <button className="flex items-center space-x-2 px-3 py-1 border border-yellow-200 rounded-lg bg-white text-gray-700 hover:bg-yellow-50">
                <span className="text-sm font-medium">Acme Corp</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              <div className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-yellow-50">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">AD</div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <Card key={card.title} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color === 'text-green-600' ? 'from-green-500 to-green-600' : card.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' : card.color === 'text-red-600' ? 'from-red-500 to-red-600' : card.color === 'text-yellow-600' ? 'from-yellow-500 to-yellow-600' : card.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' : card.color === 'text-orange-600' ? 'from-orange-500 to-orange-600' : card.color === 'text-indigo-600' ? 'from-indigo-500 to-indigo-600' : 'from-red-500 to-red-600'} text-white`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {card.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Statistics & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-yellow-600" />
                  Cost Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600">Financial metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$125,430</div>
                    <div className="text-sm text-gray-500">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$0.47</div>
                    <div className="text-sm text-gray-500">Cost per Mile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$415</div>
                    <div className="text-sm text-gray-500">Cost per Day</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="totalCost" fill="#eab308" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-yellow-600" />
                  Cost Trends
                </CardTitle>
                <CardDescription className="text-gray-600">Monthly cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="costPerMile" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="costPerDay" stroke="#10b981" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
