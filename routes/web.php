<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotationController;
use App\Models\Client;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/quotations/config', function () {
    $path = storage_path('app/config/quotations.json');
    $config = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
    return inertia('Quotations/Config', ['config' => $config]);
})->name('quotations.config');

Route::post('/quotations/config', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'logo' => 'nullable|string',
        'color' => 'nullable|string',
        'contact.name' => 'nullable|string|max:255',
        'contact.email' => 'nullable|email|max:255',
        'contact.phone' => 'nullable|string|max:255',
        'payment_terms' => 'nullable|array',
        'payment_terms.*' => 'string|max:255',
    ]);

    $path = storage_path('app/config');
    if (!is_dir($path)) mkdir($path, 0755, true);
    file_put_contents("$path/quotations.json", json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    return redirect()->route('quotations.config')->with('success', 'Configuración guardada');
});

Route::post('/quotations/config/logo', function (\Illuminate\Http\Request $request) {
    $request->validate(['logo' => 'required|image|mimes:png,jpg,jpeg,svg|max:2048']);
    $file = $request->file('logo');
    $name = 'logo.' . $file->extension();
    $file->move(public_path('logos'), $name);
    return response()->json(['url' => '/logos/' . $name]);
});

Route::resource('quotations', QuotationController::class);

Route::get('/quotations/{quotation}/pdf', [QuotationController::class, 'downloadPdf'])->name('quotations.pdf');
Route::post('/quotations/save-and-download', [QuotationController::class, 'saveAndDownload'])->name('quotations.save-and-download');

Route::post('/clients', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'company' => 'nullable|string|max:255',
    ]);
    $client = Client::create($validated);
    return response()->json($client);
});