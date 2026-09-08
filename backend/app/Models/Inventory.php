<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'location',
        'qty',
        'unit',
        'status',
        'value',
        'addedDate',
        'notes',
        'photo',
    ];
}
