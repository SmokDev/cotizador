@php
    $accent = $accentColor ?? '#b8860b';
    $logoImg = $logo ?? null;
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <style>
        @page { margin: 72px; }
        body {
            font-family: Arial, sans-serif;
            color: #3a3a3a;
            font-size: 11px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .header-info { text-align: right; }
        .header-info p { font-size: 0.875rem; margin: 0.25rem 0; }
        .header-info strong { font-weight: 600; }
        .client-section { margin: 1rem 0; }
        .client-name { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.5rem 0; color: {{ $accent }}; }
        .client-company { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.5rem 0; }
        .item-table { width: 100%; border-collapse: separate; border-spacing: 0 9px; margin: 20px 0; }
        .item-table thead th {
            background-color: {{ $accent }};
            color: #fff;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 12px;
            padding: 0.875rem;
        }
        .item-table thead th:first-child { border-radius: 8px 0 0 8px; }
        .item-table thead th:last-child { border-radius: 0 8px 8px 0; }
        .item-table tbody td {
            padding: 0.875rem;
            background-color: #fff;
            border-top: 1px solid {{ $accent }};
            border-bottom: 1px solid {{ $accent }};
        }
        .item-table tbody tr td:first-child {
            border-left: 1px solid {{ $accent }};
            border-radius: 8px 0 0 8px;
        }
        .item-table tbody tr td:last-child {
            border-right: 1px solid {{ $accent }};
            border-radius: 0 8px 8px 0;
        }
        .terms-totals { margin-top: auto; }
        .terms {
            width: 66.66%;
            float: left;
            font-size: 0.875rem;
            color: #3a3a3a;
        }
        .terms h3 { font-weight: 600; color: {{ $accent }}; margin: 0 0 0.5rem 0; }
        .terms p { margin: 0.25rem 0; }
        .totals {
            width: 33.33%;
            float: right;
            background-color: {{ $accent }};
            color: #fff;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid {{ $accent }};
            font-size: 0.875rem;
            box-sizing: border-box;
        }
        .totals .row { display: flex; justify-content: space-between; gap: 0.5rem; margin: 0.25rem 0; }
        .totals .divider { border: none; border-top: 1px solid rgba(255,255,255,0.4); margin: 0.5rem 0; }
        .totals .final { font-weight: bold; font-size: 1rem; }
        .clearfix::after { content: ""; display: table; clear: both; }
        .footer-section { margin-top: auto; }
        .footer-text {
            text-align: center;
            font-size: 0.75rem;
            color: #3a3a3a;
            padding-top: 1.5rem;
            border-top: 4px solid {{ $accent }};
            margin: 0;
        }
    </style>
</head>
<body>

    <div style="display:flex; flex-direction:column; min-height:100%; gap:20px;">

        {{-- HEADER --}}
        <div class="header">
            <div>
                @if($logoImg)
                    <img src="{{ public_path(ltrim($logoImg, '/')) }}" alt="Logo" style="width:280px; max-width:280px; display:block;" />
                @else
                    <h1 style="color:{{ $accent }}; margin:0; font-size:1.5rem; font-weight:bold;">COTIZACIÓN</h1>
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
                <p class="client-company">{{ $invoice->client->company }}</p>
            @endif
        </div>
        @endif

        {{-- TITLE --}}
        @if($invoice->title)
            <p style="font-size:1rem; font-weight:600; margin:0; color:#4a4a4a;">{{ $invoice->title }}</p>
        @endif

        {{-- DESCRIPTION --}}
        @if($invoice->description)
            <p style="font-size:0.875rem; margin:0; color:#666;">{{ $invoice->description }}</p>
        @endif

        {{-- ITEMS TABLE --}}
        @php
            $totalSubtotal = 0;
            $totalDiscount = 0;
            $totalSubtotalAfter = 0;
            $totalIva = 0;
            $totalFinal = 0;
        @endphp

        <table class="item-table">
            <thead>
                <tr>
                    <th style="width:40%; text-align:left;">Descripción</th>
                    <th style="width:15%; text-align:center;">Cantidad</th>
                    <th style="width:15%; text-align:center;">P/U</th>
                    <th style="width:15%; text-align:center;">Desc.</th>
                    <th style="width:15%; text-align:right;">Total</th>
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
                    <td style="text-align:left;">{{ $item->description }}</td>
                    <td style="text-align:center;">{{ number_format($qty, 2) }}</td>
                    <td style="text-align:center;">${{ number_format($unitPriceValue, 2) }}</td>
                    <td style="text-align:center;">{{ $discountPct > 0 ? $discountPct . '%' : '-' }}</td>
                    <td style="text-align:right;">${{ number_format($lineSubtotal, 2) }}</td>
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
                <p><strong>Forma de pago:</strong> {{ $invoice->payment_terms ?? '' }}</p>
                @if($invoice->notes)
                    <p><strong>Notas:</strong></p>
                    @foreach(explode("\n", $invoice->notes) as $line)
                        <p style="margin-left:1rem;">{{ $line ?: '&nbsp;' }}</p>
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
                    <span>IVA:</span>
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
        <div class="footer-section">
            @php $c = $invoice->contact; @endphp
            @if(!empty($c['name']) || !empty($c['phone']) || !empty($c['email']))
                <p style="font-size:0.875rem; color:#3a3a3a; margin:0 0 4px 0;">
                    {{ $c['name'] ?? '' }}
                    {{ !empty($c['phone']) ? '| ' . $c['phone'] : '' }}
                    {{ !empty($c['email']) ? '| ' . $c['email'] : '' }}
                </p>
            @endif
            <p class="footer-text">Gracias por su preferencia</p>
        </div>

    </div>

</body>
</html>