<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Obtener todas las cotizaciones.
     */
    public function index()
    {
        // Traemos las facturas junto con su cliente (Eager Loading) para evitar N+1 queries.
        $invoices = Invoice::with('client')->latest()->get();
        
        // Retornamos como JSON como ejemplo básico.
        // Si usas Inertia.js (React/Vue), esto sería algo como: 
        // return inertia('Invoices/Index', ['invoices' => $invoices]);
        return response()->json($invoices);
    }

    /**
     * Guardar una nueva cotización con sus items.
     */
    public function store(Request $request)
    {
        // En un proyecto escalable, esta validación iría en un "FormRequest" separado.
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'number' => 'required|integer|unique:invoices',
            'date' => 'required|date',
            'expiration_date' => 'required|date',
            'notes' => 'nullable|string',
            'contact' => 'required|array',       // Nuestro campo JSON
            'payment_terms' => 'required|string',
            'delivery_label' => 'required|string',
            'days_delivery' => 'required|integer',
            
            // Validando el arreglo de items
            'items' => 'required|array',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.unit_price' => 'required', // Puede ser numérico o asociativo basado en la interfaz
            'items.*.percent_discount' => 'nullable|numeric',
        ]);

        // Usamos una transacción para asegurar que la Cotización y sus Items se guarden juntos.
        // Si falla un item, no se crea la cotización vacía.
        $invoice = DB::transaction(function () use ($validated) {
            
            // 1. Crear la Cotización Base
            $invoice = Invoice::create($validated);

            // 2. Formatear y Crear los Items
            $items = collect($validated['items'])->map(function ($item) {
                // Asignar un descuento por defecto si no viene
                $item['percent_discount'] = $item['percent_discount'] ?? 0;
                return $item;
            });

            // createMany inserta los registros y asocia automáticamente el id de la factura.
            $invoice->items()->createMany($items->toArray());

            // Retornar la factura recién creada con sus items asociados
            return $invoice->load('items');
        });

        return response()->json($invoice, 201);
    }

    /**
     * Mostrar una cotización específica con todos sus detalles.
     */
    public function show(Invoice $invoice)
    {
        // Cargamos las relaciones que vamos a necesitar en la vista
        $invoice->load(['client', 'items']);
        
        return response()->json($invoice);
    }

    /**
     * Actualizar una cotización.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'contact' => 'sometimes|required|array',
            // Otras validaciones aquí...
        ]);
        
        $invoice->update($validated);
        
        // La actualización de items suele involucrar borrar/recrear o sincronizar
        // Puedes agregar esa lógica si llega información en $request->items
        
        return response()->json($invoice);
    }

    /**
     * Eliminar una cotización.
     */
    public function destroy(Invoice $invoice)
    {
        // Gracias a que en la migración pusimos "cascadeOnDelete()", 
        // los invoice_items se eliminarán automáticamente.
        $invoice->delete();
        
        return response()->json(['message' => 'Cotización eliminada correctamente'], 204);
    }
}
