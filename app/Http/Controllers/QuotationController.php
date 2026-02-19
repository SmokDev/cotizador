<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quotation;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\UpdateQuotationRequest;
use Inertia\Inertia;

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

        foreach ($request->input('items', []) as $itemData) {
            $prices = $itemData['prices'] ?? [];
            unset($itemData['prices']);

            $item = $quotation->items()->create($itemData);
            $item->prices()->createMany($prices);
        }

        return redirect()->route('quotations.index');
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['client', 'items.prices']);
        return Inertia::render('Quotations/Show', ['quotation' => $quotation]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load('items.prices');
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'clients'   => Client::all(),
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation)
    {
        $quotation->update($request->validated());

        $items = $request->input('items', []);

        // IDs of items to keep
        $keepItemIds = array_filter(array_column($items, 'id'));

        // Delete removed items (cascades to their prices)
        $quotation->items()->whereNotIn('id', $keepItemIds)->delete();

        foreach ($items as $itemData) {
            $prices = $itemData['prices'] ?? [];
            unset($itemData['prices']);

            $item = $quotation->items()->updateOrCreate(
                ['id' => $itemData['id'] ?? null],
                $itemData
            );

            // IDs of prices to keep for this item
            $keepPriceIds = array_filter(array_column($prices, 'id'));
            $item->prices()->whereNotIn('id', $keepPriceIds)->delete();

            foreach ($prices as $priceData) {
                $item->prices()->updateOrCreate(
                    ['id' => $priceData['id'] ?? null],
                    $priceData
                );
            }
        }

        return redirect()->route('quotations.index');
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
        return redirect()->route('quotations.index');
    }
}
