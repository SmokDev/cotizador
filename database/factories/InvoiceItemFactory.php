<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    protected $model = InvoiceItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'description' => fake()->sentence(4),
            'quantity' => fake()->randomFloat(2, 1, 10),
            'unit_price' => fake()->randomElement([
                fake()->randomFloat(2, 50, 5000), // Como número directo
                [
                    'spents' => [
                        ['name' => 'Materiales', 'quantity' => fake()->randomFloat(2, 10, 1000)],
                        ['name' => 'Mano de obra', 'quantity' => fake()->randomFloat(2, 100, 500)],
                    ],
                    'utility' => fake()->randomFloat(2, 5, 50)
                ]
            ]),
            'percent_discount' => fake()->randomElement([0, 0, 0, 5, 10, 15, 20]),
        ];
    }
}
