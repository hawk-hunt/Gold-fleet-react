<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Inspection') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="POST" action="{{ route('inspections.update', $inspection) }}">
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
                                    <option value="{{ $vehicle->id }}" {{ old('vehicle_id', $inspection->vehicle_id) == $vehicle->id ? 'selected' : '' }}>
                                        {{ $vehicle->registration_number }} - {{ $vehicle->make }} {{ $vehicle->model }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Inspection Type -->
                        <div class="mb-6">
                            <label for="inspection_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Inspection Type
                            </label>
                            <input type="text" name="inspection_type" id="inspection_type" 
                                value="{{ old('inspection_type', $inspection->inspection_type) }}"
                                placeholder="e.g., Pre-trip Inspection, Annual Inspection"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('inspection_type') border-red-500 @else border @enderror"
                                required>
                            @error('inspection_type')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Inspection Date -->
                        <div class="mb-6">
                            <label for="inspection_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Inspection Date
                            </label>
                            <input type="date" name="inspection_date" id="inspection_date" 
                                value="{{ old('inspection_date', $inspection->inspection_date) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('inspection_date') border-red-500 @else border @enderror"
                                required>
                            @error('inspection_date')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Result -->
                        <div class="mb-6">
                            <label for="result" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Result
                            </label>
                            <select name="result" id="result" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('result') border-red-500 @enderror"
                                required>
                                <option value="passed" {{ old('result', $inspection->result) == 'passed' ? 'selected' : '' }}>Passed</option>
                                <option value="failed" {{ old('result', $inspection->result) == 'failed' ? 'selected' : '' }}>Failed</option>
                            </select>
                            @error('result')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Checklist Items -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Inspection Checklist
                            </label>
                            @php
                                $checklist = is_string($inspection->checklist) ? json_decode($inspection->checklist, true) : $inspection->checklist;
                                $checklist = is_array($checklist) ? $checklist : [];
                            @endphp
                            <div class="space-y-2">
                                @foreach(['Brakes', 'Tires', 'Lights', 'Wipers', 'Mirrors', 'Seatbelts'] as $item)
                                    <label class="flex items-center">
                                        <input type="checkbox" name="checklist[]" value="{{ strtolower($item) }}" 
                                            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600"
                                            {{ in_array(strtolower($item), $checklist) ? 'checked' : '' }}>
                                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $item }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="mb-6">
                            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <select name="status" id="status" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border"
                                required>
                                <option value="completed" {{ old('status', $inspection->status) == 'completed' ? 'selected' : '' }}>Completed</option>
                                <option value="pending" {{ old('status', $inspection->status) == 'pending' ? 'selected' : '' }}>Pending</option>
                            </select>
                            @error('status')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Notes -->
                        <div class="mb-6">
                            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes
                            </label>
                            <textarea name="notes" id="notes" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">{{ old('notes', $inspection->notes) }}</textarea>
                            @error('notes')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                Update Inspection
                            </button>
                            <a href="{{ route('inspections.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
