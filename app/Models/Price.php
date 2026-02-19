<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'item_id',
        'quantity',
        'unit_price',
        'discount',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'discount'   => 'decimal:2',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
