<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    /**
     * Obtener todas las cotizaciones.
     */
    public function index()
    {
        $invoices = Invoice::with(['client', 'items'])
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

        return inertia('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => [
                'search' => request('search'),
                'date' => request('date'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
            ],
        ]);
    }

    /**
     * Mostrar la vista para crear una nueva cotización.
     */
    public function create()
    {
        $clients = Client::orderByRaw('last_used_at desc nulls last')->orderBy('name')->take(5)->get();

        $config = self::loadConfig();
        $paymentTerms = $config['payment_terms'] ?? [];
        $configContact = $config['contact'] ?? [];

        return inertia('Invoices/Create', [
            'clients' => $clients,
            'paymentTerms' => $paymentTerms,
            'configContact' => $configContact,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    /**
     * Guardar una nueva cotización con sus items.
     */
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
            'delivery_label'       => 'required|string',
            'days_delivery'        => 'required|integer',

            'items'                          => 'required|array',
            'items.*.description'            => 'required|string',
            'items.*.quantity'               => 'required|numeric',
            'items.*.unit_price'             => 'required',
            'items.*.percent_discount'       => 'nullable|numeric',
        ]);

        $validated['description'] ??= '';
        $validated['notes'] ??= '';

        $invoice = DB::transaction(function () use ($validated) {
            $invoice = Invoice::create($validated);
            Client::where('id', $validated['client_id'])->update(['last_used_at' => now()]);

            $items = collect($validated['items'])->map(function ($item) {
                $item['percent_discount'] = $item['percent_discount'] ?? 0;
                return $item;
            });

            $invoice->items()->createMany($items->toArray());

            return $invoice->load('items');
        });

        return redirect()->route('invoices.index');
    }

    /**
     * Mostrar una cotización específica con todos sus detalles.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load(['client', 'items']);
        $config = self::loadConfig();
        return inertia('Invoices/Show', [
            'invoice' => $invoice,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    /**
     * Generar y descargar PDF de la cotización.
     */
    public function downloadPdf(Invoice $invoice)
    {
        $invoice->load(['client', 'items']);
        $config = self::loadConfig();

        $pdf = Pdf::loadView('pdf.quotation', [
            'invoice' => $invoice,
            'logo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);

        return $pdf->download("cotizacion-{$invoice->id}.pdf");
    }

    /**
     * Guardar y devolver ID para descarga inmediata de PDF.
     */
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
            'delivery_label'       => 'required|string',
            'days_delivery'        => 'required|integer',

            'items'                          => 'required|array',
            'items.*.description'            => 'required|string',
            'items.*.quantity'               => 'required|numeric',
            'items.*.unit_price'             => 'required',
            'items.*.percent_discount'       => 'nullable|numeric',
        ]);

        $validated['description'] ??= '';
        $validated['notes'] ??= '';

        $invoice = DB::transaction(function () use ($validated) {
            $invoice = Invoice::create($validated);
            Client::where('id', $validated['client_id'])->update(['last_used_at' => now()]);

            $items = collect($validated['items'])->map(function ($item) {
                $item['percent_discount'] = $item['percent_discount'] ?? 0;
                return $item;
            });
            $invoice->items()->createMany($items->toArray());
            return $invoice->fresh()->load(['items', 'client']);
        });

        return response()->json(['id' => $invoice->id]);
    }

    /**
     * Mostrar formulario de edición (redirige a create con datos).
     */
    public function edit(Invoice $invoice)
    {
        $invoice->load(['client', 'items']);
        $clients = Client::orderByRaw('last_used_at desc nulls last')->orderBy('name')->take(5)->get();

        $hasClient = $clients->contains('id', $invoice->client_id);
        if (!$hasClient && $invoice->client) {
            $clients->prepend($invoice->client);
        }

        $config = self::loadConfig();
        $paymentTerms = $config['payment_terms'] ?? [];
        $configContact = $config['contact'] ?? [];

        return inertia('Invoices/Create', [
            'clients' => $clients,
            'invoice' => $invoice,
            'paymentTerms' => $paymentTerms,
            'configContact' => $configContact,
            'configLogo' => $config['logo'] ?? null,
            'accentColor' => $config['color'] ?? '#b8860b',
        ]);
    }

    /**
     * Actualizar una cotización.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'client_id'        => 'sometimes|required|exists:clients,id',
            'title'            => 'sometimes|required|string',
            'description'      => 'sometimes|required|string',
            'contact'          => 'sometimes|required|array',
            'items'            => 'sometimes|array',
            'items.*.id'       => 'sometimes|exists:invoice_items,id',
            'items.*.description'      => 'required_with:items|string',
            'items.*.quantity'         => 'required_with:items|numeric',
            'items.*.unit_price'       => 'required_with:items',
            'items.*.percent_discount' => 'nullable|numeric',
        ]);

        DB::transaction(function () use ($invoice, $validated) {
            $oldClientId = $invoice->client_id;
            $invoice->update($validated);

            $newClientId = $validated['client_id'] ?? $oldClientId;
            if ($newClientId != $oldClientId) {
                Client::where('id', $oldClientId)->update(['last_used_at' => null]);
            }
            Client::where('id', $newClientId)->update(['last_used_at' => now()]);

            if (isset($validated['items'])) {
                $invoice->items()->delete();
                $items = collect($validated['items'])->map(function ($item) {
                    $item['percent_discount'] = $item['percent_discount'] ?? 0;
                    unset($item['id']);
                    return $item;
                });
                $invoice->items()->createMany($items->toArray());
            }
        });

        return back();
    }

    /**
     * Eliminar una cotización.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return redirect()->route('invoices.index');
    }

    private static function loadConfig(): array
    {
        $path = storage_path('app/config/quotations.json');
        if (!file_exists($path)) return [];
        return json_decode(file_get_contents($path), true) ?: [];
    }
}
