<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::resource('invoices', InvoiceController::class);

Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
Route::post('/invoices/save-and-download', [InvoiceController::class, 'saveAndDownload'])->name('invoices.save-and-download');
