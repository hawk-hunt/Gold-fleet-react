<aside
    :class="sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'"
    class="absolute inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-gray-900 text-white lg:static lg:translate-x-0 lg:w-64"
>
    <div class="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <span class="text-xl font-bold tracking-wider text-yellow-500">Gold Fleet</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1">
            <!-- Dashboard Section -->
            <li>
                <a href="{{ route('dashboard.map') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('dashboard.map*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Map Dashboard</span>
                </a>
            </li>
            <li>
                <a href="{{ route('dashboard.info') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('dashboard.info*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <span class="text-sm font-medium">Information Dashboard</span>
                </a>
            </li>

            <!-- Fleet Management Section -->
            <li class="pt-4">
                <span class="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fleet Management</span>
            </li>
            <li>
                <a href="{{ route('vehicles.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('vehicles*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
                    </svg>
                    <span class="text-sm font-medium">Vehicles</span>
                </a>
            </li>
            <li>
                <a href="{{ route('drivers.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('drivers*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Drivers</span>
                </a>
            </li>
            <li>
                <a href="{{ route('trips.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('trips*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Trips</span>
                </a>
            </li>

            <!-- Maintenance Section -->
            <li class="pt-4">
                <span class="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Maintenance</span>
            </li>
            <li>
                <a href="{{ route('services.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('services*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Services</span>
                </a>
            </li>
            <li>
                <a href="{{ route('inspections.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('inspections*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Inspections</span>
                </a>
            </li>
            <li>
                <a href="{{ route('issues.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('issues*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Issues</span>
                </a>
            </li>

            <!-- Financial Section -->
            <li class="pt-4">
                <span class="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Financial</span>
            </li>
            <li>
                <a href="{{ route('expenses.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('expenses*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                    <span class="text-sm font-medium">Expenses</span>
                </a>
            </li>
            <li>
                <a href="{{ route('fuel-fillups.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('fuel-fillups*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                    </svg>
                    <span class="text-sm font-medium">Fuel Fill-ups</span>
                </a>
            </li>

            <!-- Reminders Section -->
            <li class="pt-4">
                <span class="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Planning</span>
            </li>
            <li>
                <a href="{{ route('reminders.index') }}" class="flex items-center px-6 py-3 hover:bg-gray-800 {{ request()->routeIs('reminders*') ? 'bg-gray-800 border-l-4 border-yellow-500' : '' }}">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">Reminders</span>
                </a>
            </li>
        </ul>
    </nav>
</aside>