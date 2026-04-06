<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'number' => fake()->unique()->numberBetween(1000, 9999),
            'date' => fake()->date(),
            'expiration_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'notes' => fake()->text(),
            'contact' => [
                'name' => fake()->name(), 
                'phone' => fake()->phoneNumber()
            ],
            'payment_terms' => '50% anticipo y 50% contra entrega',
            'delivery_label' => 'Entrega estándar',
            'days_delivery' => fake()->numberBetween(1, 15),
        ];
    }
}
