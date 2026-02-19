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
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->boolean('is_single')->default(false);
            $table->integer('number')->unique();
            $table->date('date');
            $table->date('expiration_date');
            $table->text('notes')->nullable();
            $table->json('contact')->nullable();
            $table->text('footer_message')->nullable();
            $table->text('payment_terms')->nullable();
            $table->string('delivery_label')->nullable();
            $table->integer('days_delivery')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
