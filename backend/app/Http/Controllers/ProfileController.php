<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return response()->json(['success' => true, 'message' => 'profile-updated']);
    }

    /**
     * Change the user's password.
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Get company settings for the user.
     */
    public function getCompanySettings(Request $request)
    {
        $user = $request->user();
        
        $companySettings = [
            'company_name' => $user->company_name ?? '',
            'company_email' => $user->company_email ?? '',
            'company_phone' => $user->company_phone ?? '',
            'company_address' => $user->company_address ?? '',
            'company_city' => $user->company_city ?? '',
            'company_state' => $user->company_state ?? '',
            'company_zip' => $user->company_zip ?? '',
            'company_country' => $user->company_country ?? '',
            'company_registration_number' => $user->company_registration_number ?? '',
            'company_tax_id' => $user->company_tax_id ?? '',
            'company_website' => $user->company_website ?? '',
        ];

        return response()->json([
            'success' => true,
            'data' => $companySettings
        ]);
    }

    /**
     * Update company settings for the user.
     */
    public function updateCompanySettings(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['nullable', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:20'],
            'company_address' => ['nullable', 'string', 'max:255'],
            'company_city' => ['nullable', 'string', 'max:100'],
            'company_state' => ['nullable', 'string', 'max:100'],
            'company_zip' => ['nullable', 'string', 'max:20'],
            'company_country' => ['nullable', 'string', 'max:100'],
            'company_registration_number' => ['nullable', 'string', 'max:255'],
            'company_tax_id' => ['nullable', 'string', 'max:255'],
            'company_website' => ['nullable', 'url', 'max:255'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Company settings updated successfully',
            'data' => $validated
        ]);
    }

    /**
     * Get all team members for the user's company.
     */
    public function getTeamMembers(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // If no company_id, return empty array
        if (!$companyId) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $teamMembers = \App\Models\User::where('company_id', $companyId)
            ->select('id', 'name', 'email', 'role', 'company_id', 'created_at')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $teamMembers
        ]);
    }

    /**
     * Add a new team member to the company.
     */
    public function addTeamMember(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $user = $request->user();
        $companyId = $user->company_id;

        // If user doesn't have a company_id, use their user ID as a group identifier
        // This allows users to have team members even without an explicit company
        if (!$companyId) {
            $companyId = $user->id;
            // Update the current user's company_id to their own ID for future reference
            $user->update(['company_id' => $companyId]);
        }

        // Check if email already exists
        $existingUser = \App\Models\User::where('email', $validated['email'])->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'message' => 'User with this email already exists'
            ], 422);
        }

        // Create a new user
        $newUser = \App\Models\User::create([
            'name' => explode('@', $validated['email'])[0], // Use email prefix as name
            'email' => $validated['email'],
            'password' => Hash::make('TempPassword123!'), // Temporary password
            'role' => 'admin', // Auto-assign as admin when added by owner
            'company_id' => $companyId,
            'api_token' => Str::random(60),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Team member added successfully. Please share the login credentials with them.',
            'data' => [
                'id' => $newUser->id,
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role,
                'temporary_password' => 'TempPassword123!' // Include this for the owner to share
            ]
        ]);
    }

    /**
     * Remove a team member from the company.
     */
    public function removeTeamMember(Request $request, $userId)
    {
        $currentUser = $request->user();
        $userToRemove = \App\Models\User::findOrFail($userId);

        // Check if the user being removed is from the same company
        if ($userToRemove->company_id !== $currentUser->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Don't allow removing the owner themselves via company settings
        if ($userToRemove->id === $currentUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot remove yourself'
            ], 422);
        }

        $userToRemove->delete();

        return response()->json([
            'success' => true,
            'message' => 'Team member removed successfully'
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true, 'message' => 'Account deleted']);
    }
}
