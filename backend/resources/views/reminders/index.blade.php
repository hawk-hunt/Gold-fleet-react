@extends('layouts.app')

@section('title', 'Reminders')

@section('content')
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Reminders</h2>
                        <a href="{{ route('reminders.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            + Add Reminder
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
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reminder Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($reminders as $reminder)
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-6 py-4">{{ $reminder->vehicle->registration_number ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">{{ $reminder->reminder_type ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">{{ substr($reminder->description ?? '', 0, 50) }}...</td>
                                        <td class="px-6 py-4">{{ $reminder->due_date ?? 'N/A' }}</td>
                                        <td class="px-6 py-4">
                                            <span class="px-3 py-1 rounded-full text-sm font-medium {{ ($reminder->status ?? 'pending') === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                                                {{ ucfirst($reminder->status ?? 'pending') }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <a href="{{ route('reminders.edit', $reminder) }}" class="text-blue-600 hover:text-blue-800 mr-4">Edit</a>
                                            <form method="POST" action="{{ route('reminders.destroy', $reminder) }}" style="display:inline;" onsubmit="return confirm('Delete this reminder?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-600 hover:text-red-800">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">No reminders found. <a href="{{ route('reminders.create') }}" class="text-blue-600 hover:text-blue-800">Create one</a></td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    @if($reminders->hasPages())
                        <div class="mt-4">
                            {{ $reminders->links() }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
