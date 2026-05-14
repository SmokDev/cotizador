<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'title',
        'description',
        'date',
        'expiration_date',
        'notes',
        'contact',
        'payment_terms',
        'delivery_label',
        'days_delivery',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'expiration_date' => 'date',
            'contact' => 'array',
            'days_delivery' => 'integer',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
