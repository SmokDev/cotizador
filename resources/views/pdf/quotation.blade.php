<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <style>
        @page { margin: 60px 50px; }
        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            color: #3a3a3a;
            font-size: 11px;
            line-height: 1.5;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }
        .header-info { text-align: right; }
        .header-info h1 { font-size: 20px; margin: 0 0 4px 0; }
        .header-info p { margin: 2px 0; font-size: 11px; }
        .header-info strong { font-weight: 600; }
        .client-section { margin-bottom: 20px; }
        .client-name { font-size: 15px; font-weight: 700; margin: 0 0 4px 0; color: #b8860b; }
        .client-detail { margin: 2px 0; font-size: 11px; }
        .table { width: 100%; border-collapse: separate; border-spacing: 0 6px; margin-bottom: 20px; }
        .table thead th {
            background-color: #b8860b;
            color: #fff;
            text-transform: uppercase;
            font-size: 9px;
            font-weight: 700;
            padding: 8px 10px;
            letter-spacing: 0.5px;
        }
        .table thead th:first-child { border-radius: 6px 0 0 6px; }
        .table thead th:last-child { border-radius: 0 6px 6px 0; }
        .table tbody td {
            padding: 8px 10px;
            border: 1px solid #e5d9b5;
            background-color: #fefcf5;
        }
        .table tbody td:first-child { border-radius: 6px 0 0 6px; }
        .table tbody td:last-child { border-radius: 0 6px 6px 0; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .terms { width: 60%; font-size: 10px; }
        .terms h3 { font-size: 12px; font-weight: 700; margin: 0 0 6px 0; color: #b8860b; }
        .terms p { margin: 3px 0; }
        .totals {
            width: 35%;
            background-color: #b8860b;
            color: #fff;
            padding: 14px;
            border-radius: 8px;
            float: right;
            margin-top: -120px;
        }
        .totals .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 11px; }
        .totals .divider { border: none; border-top: 1px solid rgba(255,255,255,0.4); margin: 6px 0; }
        .totals .final { font-weight: 700; font-size: 13px; }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            padding-top: 12px;
            border-top: 3px solid #b8860b;
        }
        .clearfix::after { content: ""; display: table; clear: both; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 9px; }
        .badge-gold { background-color: #b8860b; color: #fff; }
    </style>
</head>
<body>

    {{-- HEADER --}}
    <div class="header">
        <div>
            @if($invoice->client && $invoice->client->company)
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkRlamF2dSBTYW5zLCBBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2I4ODYwYiIgZm9udC13ZWlnaHQ9IjcwMCI+Q09USVpBQ0nDk048L3RleHQ+PC9zdmc+" alt="logo" style="max-width:180px; max-height:45px;" />
            @else
                <h1 style="color:#b8860b; margin:0; font-size:22px;">COTIZACIÓN</h1>
            @endif
        </div>
        <div class="header-info">
            <p><strong>No. de Cotización:</strong> {{ $invoice->number }}</p>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($invoice->date)->format('d/m/Y') }}</p>
            @if($invoice->expiration_date)
                <p><strong>Vigencia:</strong> {{ \Carbon\Carbon::parse($invoice->expiration_date)->format('d/m/Y') }}</p>
            @endif
        </div>
    </div>

    {{-- CLIENT --}}
    @if($invoice->client)
    <div class="client-section">
        <div class="client-name">{{ $invoice->client->name }}</div>
        @if($invoice->client->company)
            <div class="client-detail">{{ $invoice->client->company }}</div>
        @endif
    </div>
    @endif

    {{-- TITLE --}}
    @if($invoice->title)
        <p style="font-size:13px; font-weight:600; margin-bottom:8px;">{{ $invoice->title }}</p>
    @endif

    {{-- DESCRIPTION --}}
    @if($invoice->description)
        <p style="margin-bottom:16px; font-size:10px; color:#666;">{{ $invoice->description }}</p>
    @endif

    {{-- ITEMS TABLE --}}
    @php
        $totalSubtotal = 0;
        $totalDiscount = 0;
        $totalSubtotalAfter = 0;
        $totalIva = 0;
        $totalFinal = 0;
    @endphp

    <table class="table">
        <thead>
            <tr>
                <th class="text-left" style="width:35%">Nombre</th>
                <th class="text-left" style="width:25%">Descripción</th>
                <th class="text-center" style="width:10%">Cant.</th>
                <th class="text-center" style="width:12%">P/U</th>
                <th class="text-center" style="width:8%">Desc.</th>
                <th class="text-right" style="width:10%">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            @php
                $unitPrice = $item->unit_price;
                $isObject = is_array($unitPrice);
                if ($isObject) {
                    $totalSpents = collect($unitPrice['spents'] ?? [])->sum('quantity');
                    $utility = $unitPrice['utility'] ?? 0;
                    $totalValue = $totalSpents * (1 + ($utility / 100));
                    $unitPriceValue = $totalValue / max((float)$item->quantity, 1);
                } else {
                    $unitPriceValue = (float) $unitPrice;
                }

                $discountPct = (float)($item->percent_discount ?? 0);
                $qty = (float)$item->quantity;
                $lineSubtotal = $unitPriceValue * $qty;
                $lineDiscount = $lineSubtotal * ($discountPct / 100);
                $lineSubtotalAfter = $lineSubtotal - $lineDiscount;
                $lineIva = $lineSubtotalAfter * 0.16;
                $lineTotal = $lineSubtotalAfter + $lineIva;

                $totalSubtotal += $lineSubtotal;
                $totalDiscount += $lineDiscount;
                $totalSubtotalAfter += $lineSubtotalAfter;
                $totalIva += $lineIva;
                $totalFinal += $lineTotal;
            @endphp
            <tr>
                <td class="text-left">{{ $item->description }}</td>
                <td class="text-left"></td>
                <td class="text-center">{{ number_format($qty, 2) }}</td>
                <td class="text-center">${{ number_format($unitPriceValue, 2) }}</td>
                <td class="text-center">{{ $discountPct > 0 ? $discountPct . '%' : '-' }}</td>
                <td class="text-right">${{ number_format($lineSubtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- TERMS AND TOTALS --}}
    <div class="clearfix">
        <div class="terms">
            <h3>Términos y condiciones</h3>
            @if($invoice->days_delivery)
                <p><strong>Tiempo de entrega:</strong> 
                    {{ is_numeric($invoice->days_delivery) ? $invoice->days_delivery . ' días hábiles a partir de su aprobación' : $invoice->days_delivery }}
                </p>
            @endif
            <p><strong>Forma de pago:</strong> {{ $invoice->payment_terms ?? '50% anticipo y 50% contra entrega' }}</p>
            @if($invoice->notes)
                <p><strong>Notas:</strong></p>
                @foreach(explode("\n", $invoice->notes) as $line)
                    <p style="margin-left:12px;">{{ $line ?: '&nbsp;' }}</p>
                @endforeach
            @endif
        </div>

        <div class="totals">
            <div class="row">
                <span>Subtotal:</span>
                <span>${{ number_format($totalSubtotal, 2) }}</span>
            </div>
            <div class="row">
                <span>Descuento:</span>
                <span>${{ number_format($totalDiscount, 2) }}</span>
            </div>
            <div class="row">
                <span>Subtotal:</span>
                <span>${{ number_format($totalSubtotalAfter, 2) }}</span>
            </div>
            <div class="row">
                <span>IVA (16%):</span>
                <span>${{ number_format($totalIva, 2) }}</span>
            </div>
            <hr class="divider" />
            <div class="row final">
                <span>Total:</span>
                <span>${{ number_format($totalFinal, 2) }}</span>
            </div>
        </div>
    </div>

    {{-- FOOTER --}}
    <div class="footer">
        @if($invoice->contact)
            <p>{{ $invoice->contact['name'] ?? '' }} | {{ $invoice->contact['phone'] ?? '' }} | {{ $invoice->contact['email'] ?? '' }}</p>
        @endif
        <p>Gracias por su preferencia</p>
    </div>

</body>
</html>