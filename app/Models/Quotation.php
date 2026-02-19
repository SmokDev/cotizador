<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'client_id',
        'title',
        'is_single',
        'number',
        'date',
        'expiration_date',
        'notes',
        'contact',
        'footer_message',
        'payment_terms',
        'delivery_label',
        'days_delivery',
    ];

    protected $casts = [
        'date'            => 'date',
        'expiration_date' => 'date',
        'contact'         => 'array',
        'is_single'       => 'boolean',
    ];

    protected $appends = ['total'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    /**
     * Calculate the quotation grand total by summing all prices across all items.
     * Each Price row: subtotal = (unit_price * quantity) * (1 - discount/100)
     */
    public function getTotalAttribute(): float
    {
        return $this->items->reduce(function (float $carry, Item $item) {
            return $carry + $item->prices->sum(function (Price $price) {
                $subtotal = $price->unit_price * $price->quantity;
                return $subtotal - ($subtotal * ($price->discount / 100));
            });
        }, 0.0);
    }
}
