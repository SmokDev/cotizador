<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE invoices RENAME TO quotations');
        DB::statement('ALTER TABLE invoice_items RENAME TO quotation_items');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE quotations RENAME TO invoices');
        DB::statement('ALTER TABLE quotation_items RENAME TO invoice_items');
    }
};