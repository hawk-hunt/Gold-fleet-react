<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Expense') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="POST" action="{{ route('expenses.update', $expense) }}">
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
                                    <option value="{{ $vehicle->id }}" {{ old('vehicle_id', $expense->vehicle_id) == $vehicle->id ? 'selected' : '' }}>
                                        {{ $vehicle->registration_number }} - {{ $vehicle->make }} {{ $vehicle->model }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_id')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Expense Type -->
                        <div class="mb-6">
                            <label for="expense_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Expense Type
                            </label>
                            <input type="text" name="expense_type" id="expense_type" 
                                value="{{ old('expense_type', $expense->expense_type) }}"
                                placeholder="e.g., Fuel, Maintenance, Insurance"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('expense_type') border-red-500 @else border @enderror"
                                required>
                            @error('expense_type')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Category -->
                        <div class="mb-6">
                            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <select name="category" id="category" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border @error('category') border-red-500 @enderror"
                                required>
                                <option value="fuel" {{ old('category', $expense->category) == 'fuel' ? 'selected' : '' }}>Fuel</option>
                                <option value="repairs" {{ old('category', $expense->category) == 'repairs' ? 'selected' : '' }}>Repairs</option>
                                <option value="insurance" {{ old('category', $expense->category) == 'insurance' ? 'selected' : '' }}>Insurance</option>
                                <option value="tolls" {{ old('category', $expense->category) == 'tolls' ? 'selected' : '' }}>Tolls</option>
                                <option value="maintenance" {{ old('category', $expense->category) == 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                                <option value="other" {{ old('category', $expense->category) == 'other' ? 'selected' : '' }}>Other</option>
                            </select>
                            @error('category')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Amount -->
                        <div class="mb-6">
                            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Amount ($)
                            </label>
                            <input type="number" name="amount" id="amount" step="0.01"
                                value="{{ old('amount', $expense->amount) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('amount') border-red-500 @else border @enderror"
                                required>
                            @error('amount')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Expense Date -->
                        <div class="mb-6">
                            <label for="expense_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Expense Date
                            </label>
                            <input type="date" name="expense_date" id="expense_date" 
                                value="{{ old('expense_date', $expense->expense_date) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white @error('expense_date') border-red-500 @else border @enderror"
                                required>
                            @error('expense_date')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Notes -->
                        <div class="mb-6">
                            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes
                            </label>
                            <textarea name="notes" id="notes" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border">{{ old('notes', $expense->notes) }}</textarea>
                            @error('notes')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                Update Expense
                            </button>
                            <a href="{{ route('expenses.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
