<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
protected $fillable = [
        'client_id', 'number', 'date', 'expiration_date', 'notes',
        'contact', 'footer_message', 'payment_terms', 'delivery_label', 'days_delivery'
    ];

    protected $casts = [
        'date' => 'date',
        'expiration_date' => 'date',
        'contact' => 'array',
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

    public function getTotalAttribute()
    {
        return $this->items->sum(function ($item) {
            $price = $item->unit_price;
            $unitTotal = 0;
            
            if (is_numeric($price)) {
                $unitTotal = $price;
            } elseif (is_array($price) && isset($price['prices'])) {
                 // specific logic for complex price structure
                 // assuming prices is array of numbers
                 $unitTotal = array_sum($price['prices']);
            }
            
            return ($unitTotal * $item->quantity) - $item->discount;
        });
    }
}
