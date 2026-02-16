<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
protected $fillable = ['quotation_id', 'name', 'description', 'quantity', 'unit_price', 'discount', ];

    protected $casts = [
        'unit_price' => 'array',
        'discount' => 'decimal:2',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }
}
