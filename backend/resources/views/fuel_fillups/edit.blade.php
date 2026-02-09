<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Fuel Fill-up') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="POST" action="{{ route('fuel_fillups.update', $fuelFillup) }}">
                        @csrf
                        @method('PATCH')

                        <!-- Vehicle -->
                        <div class="mb-6">
                            <label for="vehicle_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Vehicle
                            </label>
                            <select name="vehicle_id" id="vehicle_id" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('vehicle_id') border-red-500 @enderror"
                                required>
                                @foreach(\App\Models\Vehicle::all() as $vehicle)
                                    <option value="{{ $vehicle->id }}" {{ old('vehicle_id', $fuelFillup->vehicle_id) == $vehicle->id ? 'selected' : '' }}>
                                        {{ $vehicle->registration_number }} - {{ $vehicle->make }} {{ $vehicle->model }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Driver -->
                        <div class="mb-6">
                            <label for="driver_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Driver
                            </label>
                            <select name="driver_id" id="driver_id" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">
                                <option value="">Select Driver (Optional)</option>
                                @foreach(\App\Models\Driver::all() as $driver)
                                    <option value="{{ $driver->id }}" {{ old('driver_id', $fuelFillup->driver_id) == $driver->id ? 'selected' : '' }}>
                                        {{ $driver->first_name }} {{ $driver->last_name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('driver_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Quantity (Liters) -->
                        <div class="mb-6">
                            <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quantity (Liters)
                            </label>
                            <input type="number" name="quantity" id="quantity" step="0.01"
                                value="{{ old('quantity', $fuelFillup->quantity) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('quantity') border-red-500 @else border @enderror"
                                required>
                            @error('quantity')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Amount -->
                        <div class="mb-6">
                            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Amount ($)
                            </label>
                            <input type="number" name="amount" id="amount" step="0.01"
                                value="{{ old('amount', $fuelFillup->amount) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('amount') border-red-500 @else border @enderror"
                                required>
                            @error('amount')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Filled Date -->
                        <div class="mb-6">
                            <label for="filled_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fill-up Date
                            </label>
                            <input type="date" name="filled_date" id="filled_date" 
                                value="{{ old('filled_date', $fuelFillup->filled_date) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('filled_date') border-red-500 @else border @enderror"
                                required>
                            @error('filled_date')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Odometer Reading -->
                        <div class="mb-6">
                            <label for="odometer_reading" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Odometer Reading (km)
                            </label>
                            <input type="number" name="odometer_reading" id="odometer_reading" step="0.01"
                                value="{{ old('odometer_reading', $fuelFillup->odometer_reading) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('odometer_reading') border-red-500 @else border @enderror"
                                required>
                            @error('odometer_reading')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Location -->
                        <div class="mb-6">
                            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Location
                            </label>
                            <input type="text" name="location" id="location" 
                                value="{{ old('location', $fuelFillup->location) }}"
                                placeholder="e.g., Downtown Gas Station, Highway Fuel Stop"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">
                            @error('location')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Notes -->
                        <div class="mb-6">
                            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes
                            </label>
                            <textarea name="notes" id="notes" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">{{ old('notes', $fuelFillup->notes) }}</textarea>
                            @error('notes')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                Update Fill-up
                            </button>
                            <a href="{{ route('fuel_fillups.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
