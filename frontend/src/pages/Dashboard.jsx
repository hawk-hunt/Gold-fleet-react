import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Line } from 'react-chartjs-2';
import { FaCar, FaUser, FaRoad, FaGasPump, FaTools, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || user?.company_name || 'Fleet Manager';
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({}); // Track which cards are expanded

  // Toggle card expansion
  const toggleCard = (cardName) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardName]: !prev[cardName]
    }));
  };

  // Format helpers for nicer, human-friendly display
  const formatCurrency = (v) => {
    const n = Number(v || 0);
    // Use Ghana locale and GHS currency (Cedi symbol)
    try {
      return n.toLocaleString('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 });
    } catch {
      return n.toLocaleString(undefined, { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 });
    }
  };

  const formatNumber = (v, digits = 0) => {
    const n = Number(v || 0);
    return n.toLocaleString(undefined, { maximumFractionDigits: digits });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard stats
        const statsResponse = await api.getDashboardStats();
        setStats(statsResponse);

        // Fetch chart data
        const chartResponse = await api.getChartData();
        if (chartResponse && (chartResponse.labels || chartResponse.expenses)) {
          setChartData({
            labels: chartResponse.labels || [],
            datasets: [
              {
                label: 'Total Expenses',
                data: chartResponse.expenses || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1,
              },
              {
                label: 'Fuel Costs',
                data: chartResponse.revenue || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.1,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header Section - Centered */}
          <div className="flex flex-col items-center justify-center text-center py-8">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-3 text-lg text-gray-600">Welcome back, {userName}! Here's your fleet overview.</p>
          </div>

          {/* Quick links summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 px-4">
            {[
              { title: 'Vehicles', desc: 'View and manage vehicles', path: '/vehicles', icon: <FaCar /> },
              { title: 'Drivers', desc: 'View and manage drivers', path: '/drivers', icon: <FaUser /> },
              { title: 'Trips', desc: 'Track trip history', path: '/trips', icon: <FaRoad /> },
              { title: 'Fuel Fillups', desc: 'Log fuel fillups', path: '/fuel-fillups', icon: <FaGasPump /> },
              { title: 'Maintenance', desc: 'Schedule services', path: '/services', icon: <FaTools /> },
              { title: 'Tracking', desc: 'Live vehicle map', path: '/map', icon: <FaMapMarkerAlt /> },
              { title: 'Expenses', desc: 'Record expenses', path: '/expenses', icon: <FaMoneyBillWave /> },
            ].map(item => (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer flex items-center space-x-4"
              >
                <div className="text-3xl text-yellow-600">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard
              icon={<FaMoneyBillWave />}
              title="Total Cost of Ownership"
              value={formatCurrency(stats?.total_cost)}
              description={`↑ ${formatNumber(stats?.cost_increase_percent)}% vs last month`}
              onClick={() => toggleCard('tco')}
            >
              {expandedCards.tco && (
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p>Your total fleet operating costs for this year are <span className="font-semibold text-gray-900">{formatCurrency(stats?.total_cost)}</span>, with a <span className="text-green-600">↑ {formatNumber(stats?.cost_increase_percent)}% change</span> from last month.</p>
                  <p className="text-xs text-gray-500">This includes all fuel, maintenance, repairs, insurance, and operational expenses.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              icon={<FaMoneyBillWave />}
              title="Total Expense"
              value={formatCurrency(stats?.total_expenses)}
              description="This month"
              onClick={() => toggleCard('expense')}
            >
              {expandedCards.expense && (
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p>Your total expenses for this month totalled <span className="font-semibold text-gray-900">{formatCurrency(stats?.total_expenses)}</span>.</p>
                  <p className="text-xs text-gray-500">This breaks down monthly expenses and helps track your operational spending patterns.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              icon={<FaRoad />}
              title="Avg MPG"
              value={formatNumber(stats?.avg_mpg, 1)}
              description="Fleet average"
              onClick={() => toggleCard('mpg')}
            >
              {expandedCards.mpg && (
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p>Your fleet is averaging <span className="font-semibold text-gray-900">{formatNumber(stats?.avg_mpg, 1)} miles per gallon</span>, indicating your overall fuel efficiency across all vehicles.</p>
                  <p className="text-xs text-gray-500">Higher MPG means better fuel economy and lower operational costs.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              icon={<span className="text-red-600 font-bold">!</span>}
              title="Vehicle Downtime"
              value={`${formatNumber(stats?.downtime_days, 1)} days`}
              description="Pending maintenance"
              onClick={() => toggleCard('downtime')}
            >
              {expandedCards.downtime && (
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p>Your fleet currently has <span className="font-semibold text-gray-900">{formatNumber(stats?.downtime_days, 1)} days</span> of downtime, with <span className="font-semibold text-gray-900">{stats?.active_vehicles || 0}</span> vehicles operational.</p>
                  <p className="text-xs text-gray-500">Minimizing downtime ensures maximum fleet productivity and revenue generation.</p>
                </div>
              )}
            </StatCard>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overdue Reminders"
              value={stats?.overdue_reminders || 0}
              description="Action required"
              onClick={() => toggleCard('overdue')}
            >
              {expandedCards.overdue && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
                  <p>You have <span className="font-semibold text-gray-900">{stats?.overdue_reminders || 0}</span> overdue maintenance reminders that need immediate attention to prevent vehicle issues.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              title="Open Issues"
              value={stats?.open_issues || 0}
              description="Needs review"
              onClick={() => toggleCard('issues')}
            >
              {expandedCards.issues && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
                  <p>You have <span className="font-semibold text-gray-900">{stats?.open_issues || 0}</span> open vehicle issues currently pending resolution and review.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              title="Maintenance Queue"
              value={stats?.maintenance_queue || 0}
              description="Scheduled"
              onClick={() => toggleCard('queue')}
            >
              {expandedCards.queue && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
                  <p>You have <span className="font-semibold text-gray-900">{stats?.maintenance_queue || 0}</span> maintenance tasks scheduled for your fleet to keep vehicles in optimal condition.</p>
                </div>
              )}
            </StatCard>

            <StatCard
              title="Renewal Count"
              value={stats?.renewal_count || 0}
              description="Upcoming"
              onClick={() => toggleCard('renewal')}
            >
              {expandedCards.renewal && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
                  <p>You have <span className="font-semibold text-gray-900">{stats?.renewal_count || 0}</span> upcoming renewals including vehicle registrations, insurance policies, and inspection certificates.</p>
                </div>
              )}
            </StatCard>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Trends Over Time</h3>
              {chartData ? (
                <div className="relative h-72 w-full">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            boxWidth: 14,
                            color: 'rgba(15,23,42,0.7)'
                          }
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        }
                      },
                      elements: {
                        line: {
                          tension: 0.35,
                          borderWidth: 2,
                        },
                        point: {
                          radius: 2,
                        }
                      },
                      scales: {
                        x: {
                          ticks: { color: 'rgba(15,23,42,0.65)' },
                          grid: { color: 'rgba(15,23,42,0.03)' }
                        },
                        y: {
                          beginAtZero: true,
                          ticks: { color: 'rgba(15,23,42,0.65)' },
                          grid: { color: 'rgba(15,23,42,0.03)' }
                        },
                      },
                      animation: {
                        easing: 'easeOutQuart'
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative h-72 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-2 text-gray-600 font-medium">No chart data available</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/95 shadow-sm border-2 border-yellow-500 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats?.total_cost)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Cost per Mile</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats?.cost_per_mile)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cost per Day</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats?.cost_per_day)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
