<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            
            $table->string('title');
            $table->text('description');
            $table->unsignedBigInteger('number')->unique();
            $table->date('date');
            $table->date('expiration_date');
            $table->text('notes')->nullable();
            
            $table->json('contact'); 
            
            $table->string('payment_terms');
            $table->string('delivery_label');
            $table->unsignedInteger('days_delivery');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
