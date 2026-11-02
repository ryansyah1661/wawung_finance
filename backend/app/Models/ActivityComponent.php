<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityComponent extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'code',
        'name',
        'group_name',
        'qty',
        'unit',
        'freq',
        'freq_unit',
        'unit_price',
        'total_budget',
        'description',
        'order_num',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
        'freq' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_budget' => 'decimal:2',
    ];

    public function activity()
    {
        return $this->belongsTo(ProjectActivity::class, 'activity_id');
    }
}
