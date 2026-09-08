<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'date',
        'description',
        'category',
        'account',
        'amount',
        'type', // 'income' atau 'expense'
    ];
}
