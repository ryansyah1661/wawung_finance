<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'date',
        'description',
        'program',
        'category',
        'account',
        'amount',
        'type', // 'income' atau 'expense'
        'status', // 'verified' atau 'pending'
    ];
}
