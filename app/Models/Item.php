<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'quotation_id',
        'name',
        'description',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function prices()
    {
        return $this->hasMany(Price::class);
    }
}
