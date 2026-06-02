<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('quotations', 'number')) {
                $columns[] = 'number';
            }
            if (Schema::hasColumn('quotations', 'delivery_label')) {
                $columns[] = 'delivery_label';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }

    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->unsignedBigInteger('number')->nullable();
            $table->string('delivery_label')->nullable();
        });
    }
};
