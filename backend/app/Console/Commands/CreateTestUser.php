<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\User;
use Illuminate\Console\Command;

class CreateTestUser extends Command
{
    protected $signature = 'create:test-user';
    protected $description = 'Create a test user for development';

    public function handle()
    {
        $company = Company::firstOrCreate(
            ['id' => 1],
            ['name' => 'Test Company']
        );

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'company_id' => $company->id,
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now()
            ]
        );

        $this->info("Test user created: {$user->email}");
        $this->info("ID: {$user->id}");
    }
}
