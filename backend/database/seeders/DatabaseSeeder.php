<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Notification;
use App\Models\Vehicle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create a sample company
        $company = Company::updateOrCreate(
            ['email' => 'demo@goldfleet.com'],
            [
                'name' => 'Gold Fleet Demo Company',
                'email' => 'demo@goldfleet.com',
                'phone' => '+1-555-0123',
                'address' => '123 Fleet Street, Demo City, DC 12345',
                'status' => 'active',
            ]
        );

        // Create system super admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@goldfleet.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'company_id' => null,
                'email_verified_at' => now(),
            ]
        );

        $admin->update(['role' => 'super_admin']);

        // Create company admin
        $companyAdmin = User::updateOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Company Admin',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'email_verified_at' => now(),
            ]
        );
        $companyAdmin->update(['role' => 'company_admin']);

        // Create regular user
        User::updateOrCreate(
            ['email' => 'user@demo.com'],
            [
                'name' => 'Fleet Manager',
                'email' => 'user@demo.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'fleet_manager',
                'email_verified_at' => now(),
            ]
        );

        // Update existing test user if exists
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $testUser->update(['company_id' => $company->id, 'role' => 'driver']);
        }

        // Create sample notifications
        Notification::create([
            'company_id' => $company->id,
            'user_id' => $companyAdmin->id,
            'type' => 'info',
            'title' => 'Welcome to Gold Fleet',
            'message' => 'Your fleet management system is now active. Start by adding your vehicles and drivers.',
            'read' => false,
        ]);

        Notification::create([
            'company_id' => $company->id,
            'user_id' => null, // Company-wide
            'type' => 'warning',
            'title' => 'Vehicle Maintenance Due',
            'message' => 'Vehicle #101 is due for service in 3 days.',
            'read' => false,
        ]);

        Notification::create([
            'company_id' => $company->id,
            'user_id' => $companyAdmin->id,
            'type' => 'success',
            'title' => 'Trip Completed',
            'message' => 'Trip #123 has been completed successfully.',
            'read' => true,
        ]);

        // Create sample vehicles
        Vehicle::updateOrCreate(
            ['license_plate' => 'ABC-123'],
            [
                'company_id' => $company->id,
                'make' => 'Ford',
                'model' => 'F-150',
                'year' => 2022,
                'vin' => '1FTFW1ET2DFC12345',
                'status' => 'active',
                'fuel_capacity' => 26.0,
                'fuel_type' => 'gasoline',
            ]
        );

        Vehicle::updateOrCreate(
            ['license_plate' => 'XYZ-789'],
            [
                'company_id' => $company->id,
                'make' => 'Chevrolet',
                'model' => 'Silverado',
                'year' => 2021,
                'vin' => '1GCVKREH1FZ123456',
                'status' => 'active',
                'fuel_capacity' => 24.0,
                'fuel_type' => 'diesel',
            ]
        );

        Vehicle::updateOrCreate(
            ['license_plate' => 'DEF-456'],
            [
                'company_id' => $company->id,
                'make' => 'Ram',
                'model' => '1500',
                'year' => 2023,
                'vin' => '1C6SRFHTXKN123789',
                'status' => 'maintenance',
                'fuel_capacity' => 23.0,
                'fuel_type' => 'gasoline',
            ]
        );
    }
}
