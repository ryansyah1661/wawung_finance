<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectOutput extends Model
{
    use HasFactory;

    protected $fillable = [
        'outcome_id',
        'code',
        'name',
        'description',
        'order_num',
    ];

    public function outcome()
    {
        return $this->belongsTo(ProjectOutcome::class, 'outcome_id');
    }

    public function activities()
    {
        return $this->hasMany(ProjectActivity::class, 'output_id')->orderBy('order_num')->orderBy('id');
    }
}
