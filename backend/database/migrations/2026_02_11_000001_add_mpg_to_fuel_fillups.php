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
        if (!Schema::hasTable('fuel_fillups')) {
            return;
        }

        Schema::table('fuel_fillups', function (Blueprint $table) {
            if (!Schema::hasColumn('fuel_fillups', 'mpg')) {
                $table->decimal('mpg', 6, 2)->nullable()->after('total_cost');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('fuel_fillups')) {
            return;
        }

        Schema::table('fuel_fillups', function (Blueprint $table) {
            if (Schema::hasColumn('fuel_fillups', 'mpg')) {
                $table->dropColumn('mpg');
            }
        });
    }
};
