@extends('layouts.app')

@section('title', 'Information Dashboard')

@section('content')
<div class="flex-1 p-6">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Information Dashboard</h1>
        <p class="text-gray-600">Analytics and insights for fleet performance</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Vehicles</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalVehicles }}</p>
                    <p class="text-xs text-green-600">{{ $activeVehicles }} active</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Drivers</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalDrivers }}</p>
                    <p class="text-xs text-green-600">{{ $activeDrivers }} active</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                    <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Trips</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalTrips }}</p>
                    <p class="text-xs text-green-600">{{ $completedTrips }} completed</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                    <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Monthly Expenses</p>
                    <p class="text-2xl font-bold text-gray-900">${{ number_format(array_sum($monthlyExpenses), 0) }}</p>
                    <p class="text-xs text-gray-500">This year</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Trips Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Monthly Trips</h2>
                <p class="text-sm text-gray-600">Trip count by month</p>
            </div>
            <div class="p-4">
                <canvas id="tripsChart" width="400" height="200"></canvas>
            </div>
        </div>

        <!-- Expenses Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Monthly Expenses</h2>
                <p class="text-sm text-gray-600">Expense amount by month</p>
            </div>
            <div class="p-4">
                <canvas id="expensesChart" width="400" height="200"></canvas>
            </div>
        </div>
    </div>

    <!-- Vehicle Utilization & Issues -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Vehicles by Distance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Vehicle Utilization</h2>
                <p class="text-sm text-gray-600">Top vehicles by total distance</p>
            </div>
            <div class="p-4">
                <div class="space-y-4">
                    @forelse($vehicleUtilization as $utilization)
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ $utilization->vehicle->make }} {{ $utilization->vehicle->model }}</p>
                                <p class="text-xs text-gray-500">{{ $utilization->vehicle->license_plate }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">{{ number_format($utilization->total_distance, 0) }} miles</p>
                            <p class="text-xs text-gray-500">{{ $utilization->trip_count }} trips</p>
                        </div>
                    </div>
                    @empty
                    <p class="text-gray-500 text-center py-4">No trip data available</p>
                    @endforelse
                </div>
            </div>
        </div>

        <!-- Recent Issues & Upcoming Services -->
        <div class="space-y-6">
            <!-- Recent Issues -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Recent Issues</h2>
                    <p class="text-sm text-gray-600">Latest reported vehicle issues</p>
                </div>
                <div class="p-4">
                    <div class="space-y-3">
                        @forelse($recentIssues as $issue)
                        <div class="flex items-start">
                            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ $issue->title }}</p>
                                <p class="text-xs text-gray-500">{{ $issue->vehicle->make }} {{ $issue->vehicle->model }} • {{ $issue->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                        @empty
                        <p class="text-gray-500 text-center py-4">No recent issues</p>
                        @endforelse
                    </div>
                </div>
            </div>

            <!-- Upcoming Services -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Upcoming Services</h2>
                    <p class="text-sm text-gray-600">Scheduled maintenance and services</p>
                </div>
                <div class="p-4">
                    <div class="space-y-3">
                        @forelse($upcomingServices as $service)
                        <div class="flex items-start">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ $service->service_type }}</p>
                                <p class="text-xs text-gray-500">{{ $service->vehicle->make }} {{ $service->vehicle->model }} • {{ $service->service_date->format('M j, Y') }}</p>
                            </div>
                        </div>
                        @empty
                        <p class="text-gray-500 text-center py-4">No upcoming services</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Trips Chart
    const tripsCtx = document.getElementById('tripsChart').getContext('2d');
    new Chart(tripsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Trips',
                data: {{ json_encode(array_values($monthlyTrips)) }},
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Expenses Chart
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    new Chart(expensesCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Expenses ($)',
                data: {{ json_encode(array_values($monthlyExpenses)) }},
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
</script>
@endsection