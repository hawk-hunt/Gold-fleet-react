import { useEffect, useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import { api } from '../services/api';

export default function Dashboard() {
  const [expenses, setExpenses] = useState({ labels: [], values: [] });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await api.getChartData();
        if (!mounted) return;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const vals = months.map((_, i) => Number(data.expenses?.[(i+1).toString()] ?? 0));
        setExpenses({ labels: months, values: vals });
      } catch (err) {
        console.error('Failed to load dashboard chart data', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Total Cost of Ownership</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">$50,000</div>
          <div className="mt-1 text-sm text-green-600 flex items-center">
            <span>↑ 12% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Total Expense</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">$12,500</div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Avg MPG</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">8.5</div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-gray-500 text-sm font-medium">Vehicle Downtime</div>
          <div className="mt-2 text-3xl font-bold text-red-600">5 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center border-l-4 border-red-500">
          <div>
            <p className="text-sm text-gray-500">Overdue Reminders</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center border-l-4 border-blue-500">
          <div>
            <p className="text-sm text-gray-500">Open Issues</p>
            <p className="text-xl font-bold">8</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center border-l-4 border-yellow-500">
          <div>
            <p className="text-sm text-gray-500">Maintenance Count</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center border-l-4 border-green-500">
          <div>
            <p className="text-sm text-gray-500">Renewal Count</p>
            <p className="text-xl font-bold">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Trends Over Time</h3>
          <div className="relative w-full bg-gray-50 rounded flex items-center justify-center h-64 md:h-72 lg:h-[50vh] p-4">
            <ChartComponent
              type="line"
              labels={expenses.labels}
              datasets={[{
                label: 'Expenses',
                data: expenses.values,
                borderColor: 'rgb(59,130,246)',
                backgroundColor: 'rgba(59,130,246,0.08)'
              }]}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-bold">$50,000</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Cost per Mile</span>
              <span className="font-bold">$1.85</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Cost per Day</span>
              <span className="font-bold">$425.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
