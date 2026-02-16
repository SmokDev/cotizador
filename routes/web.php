<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotationController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::resource('quotations', QuotationController::class);
