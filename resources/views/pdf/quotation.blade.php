@php
    $accent = $accentColor ?? '#b8860b';
    $logoImg = $logo ?? null;
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <style>
        @page {
    margin: 72px;
}

* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    color: #3a3a3a;
    font-size: 11px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
}

.page {
    display: flex;
    flex-direction: column;
    min-height: 912px;
}

.page-content {
    flex: 1;
    flex-grow: 1;
}

/* HEADER */

.header {
    width: 100%;
}

.header:after {
    content: "";
    display: table;
    clear: both;
}

.header-logo {
    float: left;
    width: 50%;
}

.header-info {
    float: right;
    width: 50%;
    text-align: right;
}

.header-info p {
    font-size: 0.875rem;
    margin: 0.25rem 0;
}

.header-info strong {
    font-weight: 700;
}

/* CLIENT */

.client-section {
    margin: 0.5rem 0;
}

.client-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: {{ $accent }};
}

.client-company {
    font-size: 1.125rem;
}

/* ITEMS */

.items-wrap {
    width: 100%;
    margin: 20px 0;
}

.items-header {
    background-color: {{ $accent }};
    color: #fff;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    padding: 0.875rem;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}

.items-header:after {
    content: "";
    display: table;
    clear: both;
}

.items-header .col {
    float: left;
}

.items-header .c-desc {
    width: 40%;
    text-align: left;
}

.items-header .c-cant {
    width: 15%;
    text-align: center;
}

.items-header .c-pu {
    width: 15%;
    text-align: center;
}

.items-header .c-desc-pct {
    width: 15%;
    text-align: center;
}

.items-header .c-total {
    width: 15%;
    text-align: right;
}

.item-row {
    border: 1px solid {{ $accent }};
    border-radius: 8px;
    padding: 0.875rem;
    margin-bottom: 12px;
    background: #fff;
}

.item-row:after {
    content: "";
    display: table;
    clear: both;
}

.item-row .col {
    float: left;
}

.item-row .c-desc {
    width: 40%;
}

.item-row .c-cant {
    width: 15%;
    text-align: center;
}

.item-row .c-pu {
    width: 15%;
    text-align: center;
}

.item-row .c-desc-pct {
    width: 15%;
    text-align: center;
}

.item-row .c-total {
    width: 15%;
    text-align: right;
}

/* TERMS + TOTALS */

.tt-wrap {
    width: 100%;
    margin-top: 20px;
}

.tt-wrap:after {
    content: "";
    display: table;
    clear: both;
}

.terms {
    float: left;
    width: 68%;
    padding-right: 2%;
    font-size: 0.875rem;
    color: #3a3a3a;
}

.terms h3 {
    font-weight: 700;
    color: {{ $accent }};
    margin: 0 0 0.5rem 0;
}

.terms p {
    margin: 0.25rem 0;
}

/* TERMS + TOTALS */

.tt-wrap {
    width: 100%;
    margin-top: 20px;
}

.tt-wrap:after {
    content: "";
    display: table;
    clear: both;
}

.terms {
    float: left;
    width: 65%;
    font-size: 0.875rem;
    color: #3a3a3a;
}

.terms h3 {
    font-weight: 700;
    color: {{ $accent }};
    margin: 0 0 0.5rem 0;
}

.terms p {
    margin: 0.25rem 0;
}
/*/* TERMS + TOTALS */

.tt-wrap {
    width: 100%;
    display: table;
    margin-top: 20px;
}

.terms {
    display: table-cell;
    width: 70%;
    vertical-align: top;
    padding-right: 20px;

    font-size: 0.875rem;
    color: #3a3a3a;
}

.terms h3 {
    font-weight: 700;
    color: {{ $accent }};
    margin: 0 0 0.5rem 0;
}

.terms p {
    margin: 0.25rem 0;
}

/* TOTALS */

.totals-wrap {
    display: table-cell;
    width: 30%;
    vertical-align: top;
}

.totals {
    background-color: {{ $accent }};
    color: #fff;
    padding: 14px;
    border-radius: 8px;
    border: 1px solid {{ $accent }};
    font-size: 0.875rem;
}

.totals .tr {
    width: 100%;
    margin-bottom: 8px;
}

.totals .lbl {
    display: inline-block;
    width: 48%;
    text-align: left;
}

.totals .val {
    display: inline-block;
    width: 48%;
    text-align: right;
}

.totals .divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.4);
    margin: 10px 0;
}

.totals .final .lbl,
.totals .final .val {
    font-weight: bold;
    font-size: 1rem;
}
/* divider */

.totals .divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.4);
    margin: 10px 0;
}

/* total final */

.totals .final .lbl,
.totals .final .val {
    font-weight: bold;
    font-size: 1rem;
}

/* FOOTER */

.footer-section {
    padding-top: 3rem;
}

.footer-contact {
    width: 66.66%;
    font-size: 0.875rem;
    color: #3a3a3a;
}

.footer-contact-name {
    font-weight: 700;
    color: #3a3a3a;
    margin: 0 0 0.1rem 0;
}

.footer-contact p { 
    margin: 0 0 0.1rem 0;
}   

.footer-msg {
    text-align: center;
    font-size: 0.75rem;
    color: #3a3a3a;
    padding-top: 0.5rem;
    border-top: 2px solid {{ $accent }};
    margin: 0.5rem 0 0 0;
}

    </style>
</head>
<body>
    <div class="page">

        <div class="page-content">

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
                <p style="font-size:1rem; font-weight:700; margin:0; color:#4a4a4a;">{{ $invoice->title }}</p>
            @endif

            {{-- DESCRIPTION --}}
            @if($invoice->description)
                <p style="font-size:0.875rem; margin:0; color:#666;">{{ $invoice->description }}</p>
            @endif

            {{-- ITEMS --}}
            @php
                $totalSubtotal = 0;
                $totalDiscount = 0;
                $totalSubtotalAfter = 0;
                $totalIva = 0;
                $totalFinal = 0;
            @endphp

            <div class="items-wrap">
                <div class="items-header">
                    <div class="col c-desc">Descripción</div>
                    <div class="col c-cant">Cantidad</div>
                    <div class="col c-pu">P/U</div>
                    <div class="col c-desc-pct">Desc.</div>
                    <div class="col c-total">Total</div>
                </div>

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
                <div class="item-row">
                    <div class="col c-desc">{{ $item->description }}</div>
                    <div class="col c-cant">{{ number_format($qty, 2) }}</div>
                    <div class="col c-pu">${{ number_format($unitPriceValue, 2) }}</div>
                    <div class="col c-desc-pct">{{ $discountPct > 0 ? $discountPct . '%' : '-' }}</div>
                    <div class="col c-total">${{ number_format($lineSubtotal, 2) }}</div>
                </div>
                @endforeach
            </div>

            {{-- TERMS AND TOTALS --}}
            <div class="tt-wrap">

    <div class="terms">
        <h3>Términos y condiciones</h3>

        @if($invoice->days_delivery)
            <p>
                <strong>Tiempo de entrega:</strong>
                {{ is_numeric($invoice->days_delivery)
                    ? $invoice->days_delivery . ' días hábiles a partir de su aprobación'
                    : $invoice->days_delivery }}
            </p>
        @endif

        <p>
            <strong>Forma de pago:</strong>
            {{ $invoice->payment_terms ?? '' }}
        </p>

        @if($invoice->notes)
            <p><strong>Notas:</strong></p>

            @foreach(explode("\n", $invoice->notes) as $line)
                <p style="margin-left:1rem;">
                    {{ $line ?: ' ' }}
                </p>
            @endforeach
        @endif
    </div>

    <div class="totals-wrap">

        <div class="totals">

            <div class="tr">
                <span class="lbl">Subtotal:</span>
                <span class="val">${{ number_format($totalSubtotal, 2) }}</span>
            </div>

            <div class="tr">
                <span class="lbl">Descuento:</span>
                <span class="val">${{ number_format($totalDiscount, 2) }}</span>
            </div>

            <div class="tr">
                <span class="lbl">Subtotal:</span>
                <span class="val">${{ number_format($totalSubtotalAfter, 2) }}</span>
            </div>

            <div class="tr">
                <span class="lbl">IVA:</span>
                <span class="val">${{ number_format($totalIva, 2) }}</span>
            </div>

            <hr class="divider" />

            <div class="tr final">
                <span class="lbl">Total:</span>
                <span class="val">${{ number_format($totalFinal, 2) }}</span>
            </div>

        </div>

    </div>

</div>

        </div>

        {{-- FOOTER --}}
        <div class="footer-section">
            @php $c = $invoice->contact; @endphp
            @if(!empty($c['name']) || !empty($c['phone']) || !empty($c['email']))
                <div class="footer-contact">
                    <h3 class="footer-contact-name">{{ $c['name'] ?? '' }}</h3>
                    @if(!empty($c['phone'])) <p>{{ $c['phone'] }}</p> @endif
                    @if(!empty($c['email'])) <p>{{ $c['email'] }}</p> @endif
                </div>
            @endif
            <p class="footer-msg">Gracias por su preferencia</p>
        </div>

    </div>
</body>
</html>