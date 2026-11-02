<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectOutcome extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'code',
        'name',
        'description',
        'order_num',
    ];

    public function program()
    {
        return $this->belongsTo(Category::class, 'program_id');
    }

    public function outputs()
    {
        return $this->hasMany(ProjectOutput::class, 'outcome_id')->orderBy('order_num')->orderBy('id');
    }
}
