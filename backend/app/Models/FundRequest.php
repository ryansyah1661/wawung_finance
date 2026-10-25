<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_number',
        'need_date',
        'applicant_name',
        'department',
        'purpose',
        'description',
        'amount',
        'items',
        'attachment',
        'status',
        'approval_note',
    ];

    protected $casts = [
        'need_date' => 'date',
        'amount'    => 'decimal:2',
        'items'     => 'array',
    ];
}
