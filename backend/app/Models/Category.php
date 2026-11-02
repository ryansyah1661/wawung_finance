<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'detail',
        'budget',
        'type',
        'status',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
    ];

    public function outcomes()
    {
        return $this->hasMany(ProjectOutcome::class, 'program_id')->orderBy('order_num')->orderBy('id');
    }
}
