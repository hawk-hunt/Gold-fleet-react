<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Soft deletes already exist in create_companies_table migration
        // This migration is now a no-op for backwards compatibility
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op for backwards compatibility
    }
};
