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
        Schema::table('users', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('role');
            $table->string('company_email')->nullable()->after('company_name');
            $table->string('company_phone')->nullable()->after('company_email');
            $table->string('company_address')->nullable()->after('company_phone');
            $table->string('company_city')->nullable()->after('company_address');
            $table->string('company_state')->nullable()->after('company_city');
            $table->string('company_zip')->nullable()->after('company_state');
            $table->string('company_country')->nullable()->after('company_zip');
            $table->string('company_registration_number')->nullable()->after('company_country');
            $table->string('company_tax_id')->nullable()->after('company_registration_number');
            $table->string('company_website')->nullable()->after('company_tax_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'company_email',
                'company_phone',
                'company_address',
                'company_city',
                'company_state',
                'company_zip',
                'company_country',
                'company_registration_number',
                'company_tax_id',
                'company_website',
            ]);
        });
    }
};
