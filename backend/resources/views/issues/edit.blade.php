<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Issue') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="POST" action="{{ route('issues.update', $issue) }}">
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
                                    <option value="{{ $vehicle->id }}" {{ old('vehicle_id', $issue->vehicle_id) == $vehicle->id ? 'selected' : '' }}>
                                        {{ $vehicle->registration_number }} - {{ $vehicle->make }} {{ $vehicle->model }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Issue Type -->
                        <div class="mb-6">
                            <label for="issue_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Issue Type
                            </label>
                            <input type="text" name="issue_type" id="issue_type" 
                                value="{{ old('issue_type', $issue->issue_type) }}"
                                placeholder="e.g., Engine Problem, Brake Failure, Electrical"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('issue_type') border-red-500 @else border @enderror"
                                required>
                            @error('issue_type')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Severity -->
                        <div class="mb-6">
                            <label for="severity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Severity Level
                            </label>
                            <select name="severity" id="severity" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('severity') border-red-500 @enderror"
                                required>
                                <option value="critical" {{ old('severity', $issue->severity) == 'critical' ? 'selected' : '' }}>Critical</option>
                                <option value="high" {{ old('severity', $issue->severity) == 'high' ? 'selected' : '' }}>High</option>
                                <option value="low" {{ old('severity', $issue->severity) == 'low' ? 'selected' : '' }}>Low</option>
                            </select>
                            @error('severity')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Description -->
                        <div class="mb-6">
                            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Issue Description
                            </label>
                            <textarea name="description" id="description" rows="4"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('description') border-red-500 @enderror"
                                required>{{ old('description', $issue->description) }}</textarea>
                            @error('description')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Reported Date -->
                        <div class="mb-6">
                            <label for="reported_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Reported Date
                            </label>
                            <input type="date" name="reported_date" id="reported_date" 
                                value="{{ old('reported_date', $issue->reported_date) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('reported_date') border-red-500 @else border @enderror"
                                required>
                            @error('reported_date')
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
                                <option value="open" {{ old('status', $issue->status) == 'open' ? 'selected' : '' }}>Open</option>
                                <option value="in_progress" {{ old('status', $issue->status) == 'in_progress' ? 'selected' : '' }}>In Progress</option>
                                <option value="resolved" {{ old('status', $issue->status) == 'resolved' ? 'selected' : '' }}>Resolved</option>
                            </select>
                            @error('status')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Resolution Notes -->
                        <div class="mb-6">
                            <label for="resolution_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Resolution Notes
                            </label>
                            <textarea name="resolution_notes" id="resolution_notes" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">{{ old('resolution_notes', $issue->resolution_notes) }}</textarea>
                            @error('resolution_notes')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                Update Issue
                            </button>
                            <a href="{{ route('issues.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
