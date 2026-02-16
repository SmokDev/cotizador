<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quotation;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\UpdateQuotationRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::with('client')->latest()->get();
        return Inertia::render('Quotations/Index', ['quotations' => $quotations]);
    }

    public function create()
    {
        return Inertia::render('Quotations/Create', [
            'clients' => Client::all()
        ]);
    }

    public function store(StoreQuotationRequest $request)
    {
        $quotation = Quotation::create($request->validated());

        if ($request->has('items')) {
            $quotation->items()->createMany($request->all()['items']);
        }

        return redirect()->route('quotations.index');
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['client', 'items']);
        return Inertia::render('Quotations/Show', ['quotation' => $quotation]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load('items');
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'clients' => Client::all()
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation)
    {
        $quotation->update($request->validated());

        $items = $request->input('items', []);
        
        // Ensure items is an array
        if (!is_array($items)) {
            $items = [];
        }

        // Get IDs of items to keep
        $keepIds = array_filter(array_column($items, 'id'));
        
        // Delete items not in the Keep list
        $quotation->items()->whereNotIn('id', $keepIds)->delete();

        // Update or Create items
        foreach ($items as $item) {
            $quotation->items()->updateOrCreate(
                ['id' => $item['id'] ?? null],
                $item
            );
        }

        return redirect()->route('quotations.index');
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
        return redirect()->route('quotations.index');
    }
}
