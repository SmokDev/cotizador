<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE quotation_items RENAME COLUMN invoice_id TO quotation_id');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE quotation_items RENAME COLUMN quotation_id TO invoice_id');
    }
};