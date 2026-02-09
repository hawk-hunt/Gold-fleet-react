<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Trip') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="POST" action="{{ route('trips.update', $trip) }}">
                        @csrf
                        @method('PATCH')

                        <!-- Trip Number -->
                        <div class="mb-6">
                            <label for="trip_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Trip Number
                            </label>
                            <input type="text" name="trip_number" id="trip_number" 
                                value="{{ old('trip_number', $trip->trip_number) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('trip_number') border-red-500 @else border @enderror"
                                required>
                            @error('trip_number')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Vehicle -->
                        <div class="mb-6">
                            <label for="vehicle_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Vehicle
                            </label>
                            <select name="vehicle_id" id="vehicle_id" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('vehicle_id') border-red-500 @enderror"
                                required>
                                @foreach(\App\Models\Vehicle::all() as $vehicle)
                                    <option value="{{ $vehicle->id }}" {{ old('vehicle_id', $trip->vehicle_id) == $vehicle->id ? 'selected' : '' }}>
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
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('driver_id') border-red-500 @enderror"
                                required>
                                @foreach(\App\Models\Driver::all() as $driver)
                                    <option value="{{ $driver->id }}" {{ old('driver_id', $trip->driver_id) == $driver->id ? 'selected' : '' }}>
                                        {{ $driver->first_name }} {{ $driver->last_name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('driver_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Origin -->
                        <div class="mb-6">
                            <label for="origin" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Origin (Start Location)
                            </label>
                            <input type="text" name="origin" id="origin" 
                                value="{{ old('origin', $trip->origin) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('origin') border-red-500 @else border @enderror"
                                required>
                            @error('origin')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Destination -->
                        <div class="mb-6">
                            <label for="destination" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Destination (End Location)
                            </label>
                            <input type="text" name="destination" id="destination" 
                                value="{{ old('destination', $trip->destination) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('destination') border-red-500 @else border @enderror"
                                required>
                            @error('destination')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Distance -->
                        <div class="mb-6">
                            <label for="distance" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Distance (km)
                            </label>
                            <input type="number" name="distance" id="distance" step="0.01"
                                value="{{ old('distance', $trip->distance) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('distance') border-red-500 @else border @enderror"
                                required>
                            @error('distance')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Estimated Duration -->
                        <div class="mb-6">
                            <label for="estimated_duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estimated Duration (hours)
                            </label>
                            <input type="number" name="estimated_duration" id="estimated_duration" step="0.5"
                                value="{{ old('estimated_duration', $trip->estimated_duration) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('estimated_duration') border-red-500 @else border @enderror"
                                required>
                            @error('estimated_duration')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Start Time -->
                        <div class="mb-6">
                            <label for="start_time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Start Time
                            </label>
                            <input type="datetime-local" name="start_time" id="start_time" 
                                value="{{ old('start_time', $trip->start_time ? date('Y-m-d\TH:i', strtotime($trip->start_time)) : '') }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('start_time') border-red-500 @else border @enderror"
                                required>
                            @error('start_time')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Status -->
                        <div class="mb-6">
                            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <select name="status" id="status" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border"
                                required>
                                <option value="completed" {{ old('status', $trip->status) == 'completed' ? 'selected' : '' }}>Completed</option>
                                <option value="ongoing" {{ old('status', $trip->status) == 'ongoing' ? 'selected' : '' }}>Ongoing</option>
                                <option value="scheduled" {{ old('status', $trip->status) == 'scheduled' ? 'selected' : '' }}>Scheduled</option>
                            </select>
                            @error('status')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                Update Trip
                            </button>
                            <a href="{{ route('trips.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
