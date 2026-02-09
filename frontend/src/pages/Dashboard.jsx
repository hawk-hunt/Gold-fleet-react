import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || user?.company_name || 'Fleet Manager';

  return (
    <div className="space-y-8">
      {/* Header Section - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-3 text-lg text-gray-600">Welcome back, {userName}! Here's your fleet overview.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cost of Ownership */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost of Ownership</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">$50,000</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            ↑ 12% vs last month
          </p>
        </div>

        {/* Total Expense */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expense</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">$12,500</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">This month</p>
        </div>

        {/* Avg MPG */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg MPG</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">8.5</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Fleet average</p>
        </div>

        {/* Vehicle Downtime */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicle Downtime</p>
              <p className="mt-2 text-3xl font-bold text-red-600">5 days</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Pending maintenance</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-l-4 border-red-500 shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-medium">Overdue Reminders</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
          <p className="text-xs text-red-600 mt-2">Action required</p>
        </div>
        <div className="bg-white rounded-lg border-l-4 border-blue-500 shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-medium">Open Issues</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
          <p className="text-xs text-blue-600 mt-2">Needs review</p>
        </div>
        <div className="bg-white rounded-lg border-l-4 border-yellow-500 shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-medium">Maintenance Queue</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
          <p className="text-xs text-yellow-600 mt-2">Scheduled</p>
        </div>
        <div className="bg-white rounded-lg border-l-4 border-green-500 shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-medium">Renewal Count</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">5</p>
          <p className="text-xs text-green-600 mt-2">Upcoming</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Trends Over Time</h3>
          <div className="relative h-72 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-2 text-gray-600 font-medium">Chart coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Cost</span>
              <span className="font-semibold text-gray-900">$50,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Cost per Mile</span>
              <span className="font-semibold text-gray-900">$1.85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost per Day</span>
              <span className="font-semibold text-gray-900">$425.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
