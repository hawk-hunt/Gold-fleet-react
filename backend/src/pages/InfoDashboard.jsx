import { useEffect, useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import { api } from '../services/api';

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
        ))}
      </div>
      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
        ))}
      </div>
    </div>
  );
}

export default function InfoDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getDashboardStats();
        if (!mounted) return;
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const buildMonthly = (obj = {}) => months.map((_, i) => Number(obj?.[(i+1).toString()] ?? 0));

  if (loading || !stats) {
    return <SkeletonLoader />;
  }

  const tripsValues = buildMonthly(stats.monthlyTrips);
  const expensesValues = buildMonthly(stats.monthlyExpenses);
  const fuelValues = buildMonthly(stats.monthlyFuelCosts);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Total Vehicles</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalVehicles}</div>
          <div className="mt-1 text-sm text-green-600">{stats.activeVehicles} active</div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Total Drivers</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalDrivers}</div>
          <div className="mt-1 text-sm text-green-600">{stats.activeDrivers} active</div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Total Trips</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalTrips}</div>
          <div className="mt-1 text-sm text-green-600">{stats.completedTrips} completed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Monthly Expenses (sum)</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">${stats.monthlyExpenses ? Object.values(stats.monthlyExpenses).reduce((a,b)=>a+Number(b||0),0).toFixed(2) : 0}</div>
          <div className="mt-1 text-sm text-gray-500">This year</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Monthly Trips</h3>
          <ChartComponent
            type="line"
            labels={months}
            datasets={[{ label: 'Trips', data: tripsValues, borderColor: 'rgb(59,130,246)', backgroundColor: 'rgba(59,130,246,0.08)', tension: 0.4 }]}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Monthly Expenses</h3>
          <ChartComponent
            type="bar"
            labels={months}
            datasets={[{ label: 'Expenses', data: expensesValues, backgroundColor: 'rgba(245,158,11,0.8)', borderColor: 'rgb(245,158,11)', borderWidth: 1 }]}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Monthly Fuel Costs</h3>
          <ChartComponent
            type="line"
            labels={months}
            datasets={[{ label: 'Fuel Costs', data: fuelValues, borderColor: 'rgb(16,185,129)', backgroundColor: 'rgba(16,185,129,0.08)', tension: 0.3 }]}
          />
        </div>
      </div>

      {/* Utilization & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Utilization</h2>
            <p className="text-sm text-gray-600">Top vehicles by total distance</p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {(stats.vehicleUtilization || []).length === 0 && (
                <p className="text-gray-500 text-center py-4">No trip data available</p>
              )}
              {(stats.vehicleUtilization || []).map((u) => (
                <div key={u.vehicle_id || u.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.vehicle?.make} {u.vehicle?.model}</p>
                      <p className="text-xs text-gray-500">{u.vehicle?.license_plate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{Number(u.total_distance || u.total_distance || 0).toLocaleString()} miles</p>
                    <p className="text-xs text-gray-500">{u.trip_count || 0} trips</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
              <p className="text-sm text-gray-600">Latest reported vehicle issues</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {(stats.recentIssues || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent issues</p>
                )}
                {(stats.recentIssues || []).map((issue) => (
                  <div key={issue.id} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                      <p className="text-xs text-gray-500">{issue.vehicle?.make} {issue.vehicle?.model} • {issue.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Services</h2>
              <p className="text-sm text-gray-600">Scheduled maintenance and services</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {(stats.upcomingServices || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming services</p>
                )}
                {(stats.upcomingServices || []).map((service) => (
                  <div key={service.id} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{service.service_type}</p>
                      <p className="text-xs text-gray-500">{service.vehicle?.make} {service.vehicle?.model} • {service.service_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
