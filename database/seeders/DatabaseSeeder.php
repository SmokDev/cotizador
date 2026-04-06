<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Client::factory(5)->create()->each(function (Client $client) {
            Invoice::factory(4)->create([
                'client_id' => $client->id,
            ])->each(function (Invoice $invoice) {
                InvoiceItem::factory(random_int(1, 5))->create([
                    'invoice_id' => $invoice->id,
                ]);
            });
        });
    }
}
