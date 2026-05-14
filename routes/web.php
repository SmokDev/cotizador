<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use App\Models\Client;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::resource('invoices', InvoiceController::class);

Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
Route::post('/invoices/save-and-download', [InvoiceController::class, 'saveAndDownload'])->name('invoices.save-and-download');

Route::post('/clients', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'company' => 'nullable|string|max:255',
    ]);
    $client = Client::create($validated);
    return response()->json($client);
});
