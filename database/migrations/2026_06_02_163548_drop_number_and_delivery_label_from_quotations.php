<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            if (Schema::hasColumn('quotations', 'number')) {
                // Drop the unique index first to avoid SQLite errors
                $table->dropUnique('invoices_number_unique');
                $table->dropColumn('number');
            }
            if (Schema::hasColumn('quotations', 'delivery_label')) {
                $table->dropColumn('delivery_label');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->unsignedBigInteger('number')->nullable()->unique('invoices_number_unique');
            $table->string('delivery_label')->nullable();
        });
    }
};
