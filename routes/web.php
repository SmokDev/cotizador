<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::resource('invoices', InvoiceController::class);
