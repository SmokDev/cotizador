<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
protected $fillable = ['name', 'empresa', 'email'];

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }
}
