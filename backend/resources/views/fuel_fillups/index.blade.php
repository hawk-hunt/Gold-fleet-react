@extends('layouts.app')

@section('title', 'Fuel Fill-ups')

@section('content')
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Fuel Fill-ups</h2>
                        <a href="{{ route('fuel-fillups.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            + Add Fuel Fill-up
                        </a>
                    </div>

                    @if(session('success'))
                        <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {{ session('success') }}
                        </div>
                    @endif

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-300">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vehicle</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Driver</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity (L)</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($fuelFillups as $fillup)
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-6 py-4">{{ $fillup->vehicle->registration_number ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">{{ $fillup->driver->first_name ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">{{ $fillup->quantity ?? 0 }}</td>
                                        <td class="px-6 py-4">${{ number_format($fillup->amount ?? 0, 2) }}</td>
                                        <td class="px-6 py-4">{{ $fillup->filled_date ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">{{ $fillup->location ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">
                                            <a href="{{ route('fuel-fillups.edit', $fillup) }}" class="text-blue-600 hover:text-blue-800 mr-4">Edit</a>
                                            <form method="POST" action="{{ route('fuel-fillups.destroy', $fillup) }}" style="display:inline;" onsubmit="return confirm('Delete this fuel fillup?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-600 hover:text-red-800">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="px-6 py-4 text-center text-gray-500">No fuel fill-ups found. <a href="{{ route('fuel-fillups.create') }}" class="text-blue-600 hover:text-blue-800">Create one</a></td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    @if($fuelFillups->hasPages())
                        <div class="mt-4">
                            {{ $fuelFillups->links() }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
