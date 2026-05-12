<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'description',
        'quantity',
        'unit_price',
        'percent_discount',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'percent_discount' => 'decimal:2',
        ];
    }

    public function getUnitPriceAttribute($value)
    {
        $decoded = json_decode((string) $value, true);
        return $decoded ?? $value;
    }

    public function setUnitPriceAttribute($value): void
    {
        $this->attributes['unit_price'] = is_array($value) 
            ? json_encode($value, JSON_UNESCAPED_UNICODE) 
            : $value;
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
