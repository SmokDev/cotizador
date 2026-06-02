<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotationController;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/config', function () {
    $path = base_path('config.json');
    $config = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
    return inertia('Quotations/Config', ['config' => $config]);
})->name('quotations.config');

Route::post('/config', function (Request $request) {
    $data = $request->validate([
        'logo' => 'nullable|string',
        'color' => 'nullable|string',
        'contact.name' => 'nullable|string|max:255',
        'contact.email' => 'nullable|email|max:255',
        'contact.phone' => 'nullable|string|max:255',
        'payment_terms' => 'nullable|array',
        'payment_terms.*' => 'string|max:255',
    ]);

    $path = base_path('config.json');
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    return redirect()->route('quotations.config')->with('success', 'Configuración guardada');
});

Route::post('/config/logo', function (Request $request) {
    $request->validate(['logo' => 'required|image|mimes:png,jpg,jpeg,svg|max:2048']);
    $file = $request->file('logo');
    $name = 'logo.' . $file->extension();
    $file->move(public_path('logos'), $name);
    return response()->json(['url' => '/logos/' . $name]);
});

Route::get('/create', [QuotationController::class, 'create'])->name('quotations.create');

Route::get('/', [QuotationController::class, 'index'])->name('quotations.index');
Route::post('/', [QuotationController::class, 'store'])->name('quotations.store');

Route::get('/{quotation}', [QuotationController::class, 'show'])->name('quotations.show');
Route::get('/{quotation}/edit', [QuotationController::class, 'edit'])->name('quotations.edit');
Route::put('/{quotation}', [QuotationController::class, 'update'])->name('quotations.update');
Route::delete('/{quotation}', [QuotationController::class, 'destroy'])->name('quotations.destroy');

Route::get('/{quotation}/pdf', [QuotationController::class, 'downloadPdf'])->name('quotations.pdf');
Route::post('/save-and-download', [QuotationController::class, 'saveAndDownload'])->name('quotations.save-and-download');

Route::post('/clients', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'company' => 'nullable|string|max:255',
    ]);
    $client = Client::create($validated);
    return response()->json($client);
});
