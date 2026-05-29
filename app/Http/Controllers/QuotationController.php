<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quotation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::with(['client', 'items'])
            ->when(request('search'), function ($query) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhereHas('client', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when(request('date'), function ($query) {
                $query->whereDate('date', request('date'));
            })
            ->when(request('start_date'), function ($query) {
                $query->whereDate('date', '>=', request('start_date'));
            })
            ->when(request('end_date'), function ($query) {
                $query->whereDate('date', '<=', request('end_date'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('Quotations/Index', [
            'quotations' => $quotations,
            'filters' => [
                'search' => request('search'),
                'date' => request('date'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
            ],
        ]);
    }

    public function create()
    {
        $clients = Client::orderByRaw('last_used_at desc nulls last')->orderBy('name')->take(5)->get();

        $config = self::loadConfig();
        $paymentTerms = $config['payment_terms'] ?? [];
        $configContact = $config['contact'] ?? [];

        return inertia('Quotations/Create', [
            'clients' => $clients,
            'paymentTerms' => $paymentTerms,
            'configContact' => $configContact,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'            => 'required|exists:clients,id',
            'title'                => 'required|string',
            'description'          => 'nullable|string',
            'date'                 => 'required|date',
            'expiration_date'      => 'required|date',
            'notes'                => 'nullable|string',
            'contact'              => 'required|array',
            'payment_terms'        => 'required|string',
            'days_delivery'        => 'required|integer',
            'is_total_individual'  => 'nullable|boolean',
            'items'                => 'required|array',
            'items.*.description'  => 'required|string',
            'items.*.quantity'     => 'required|numeric',
            'items.*.unit_price'   => 'required',
            'items.*.percent_discount' => 'nullable|numeric',
        ]);

        $validated['description'] ??= '';
        $validated['notes'] ??= '';
        $validated['is_total_individual'] = $validated['is_total_individual'] ?? false;

        $quotation = DB::transaction(function () use ($validated) {
            $quotation = Quotation::create($validated);
            Client::where('id', $validated['client_id'])->update(['last_used_at' => now()]);

            $items = collect($validated['items'])->map(function ($item) {
                $item['percent_discount'] = $item['percent_discount'] ?? 0;
                return $item;
            });

            $quotation->items()->createMany($items->toArray());

            return $quotation->load('items');
        });

        return redirect()->route('quotations.show', $quotation->id);
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['client', 'items']);
        $config = self::loadConfig();
        return inertia('Quotations/Show', [
            'quotation' => $quotation,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    public function downloadPdf(Quotation $quotation)
    {
        $quotation->load(['client', 'items']);
        $config = self::loadConfig();

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'logo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);

        return $pdf->download("cotizacion-{$quotation->id}.pdf");
    }

    public function saveAndDownload(Request $request)
    {
        $validated = $request->validate([
            'client_id'            => 'required|exists:clients,id',
            'title'                => 'required|string',
            'description'          => 'nullable|string',
            'date'                 => 'required|date',
            'expiration_date'      => 'required|date',
            'notes'                => 'nullable|string',
            'contact'              => 'required|array',
            'payment_terms'        => 'required|string',
            'days_delivery'        => 'required|integer',
            'is_total_individual'  => 'nullable|boolean',
            'items'                => 'required|array',
            'items.*.description'  => 'required|string',
            'items.*.quantity'     => 'required|numeric',
            'items.*.unit_price'   => 'required',
            'items.*.percent_discount' => 'nullable|numeric',
        ]);

        $validated['description'] ??= '';
        $validated['notes'] ??= '';
        $validated['is_total_individual'] = $validated['is_total_individual'] ?? false;

        $quotation = DB::transaction(function () use ($validated) {
            $quotation = Quotation::create($validated);
            Client::where('id', $validated['client_id'])->update(['last_used_at' => now()]);

            $items = collect($validated['items'])->map(function ($item) {
                $item['percent_discount'] = $item['percent_discount'] ?? 0;
                return $item;
            });
            $quotation->items()->createMany($items->toArray());
            return $quotation->fresh()->load(['items', 'client']);
        });

        return response()->json(['id' => $quotation->id]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load(['client', 'items']);
        $clients = Client::orderByRaw('last_used_at desc nulls last')->orderBy('name')->take(5)->get();

        $hasClient = $clients->contains('id', $quotation->client_id);
        if (!$hasClient && $quotation->client) {
            $clients->prepend($quotation->client);
        }

        $config = self::loadConfig();
        $paymentTerms = $config['payment_terms'] ?? [];
        $configContact = $config['contact'] ?? [];

        return inertia('Quotations/Create', [
            'clients' => $clients,
            'quotation' => $quotation,
            'paymentTerms' => $paymentTerms,
            'configContact' => $configContact,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'client_id'        => 'sometimes|required|exists:clients,id',
            'title'            => 'sometimes|required|string',
            'description'      => 'sometimes|required|string',
            'is_total_individual' => 'nullable|boolean',
            'contact'          => 'sometimes|required|array',
            'items'            => 'sometimes|array',
            'items.*.id'       => 'sometimes|exists:quotation_items,id',
            'items.*.description'      => 'required_with:items|string',
            'items.*.quantity'         => 'required_with:items|numeric',
            'items.*.unit_price'       => 'required_with:items',
            'items.*.percent_discount' => 'nullable|numeric',
        ]);

        DB::transaction(function () use ($quotation, $validated) {
            $oldClientId = $quotation->client_id;
            $quotation->update($validated);

            $newClientId = $validated['client_id'] ?? $oldClientId;
            if ($newClientId != $oldClientId) {
                Client::where('id', $oldClientId)->update(['last_used_at' => null]);
            }
            Client::where('id', $newClientId)->update(['last_used_at' => now()]);

            if (isset($validated['items'])) {
                $quotation->items()->delete();
                $items = collect($validated['items'])->map(function ($item) {
                    $item['percent_discount'] = $item['percent_discount'] ?? 0;
                    unset($item['id']);
                    return $item;
                });
                $quotation->items()->createMany($items->toArray());
            }
        });

        return redirect()->route('quotations.show', $quotation->id);
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
    }

    private static function loadConfig(): array
    {
        $path = storage_path('app/config/quotations.json');
        if (!file_exists($path)) return [];
        return json_decode(file_get_contents($path), true) ?: [];
    }
}