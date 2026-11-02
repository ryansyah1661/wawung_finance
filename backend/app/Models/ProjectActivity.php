<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'output_id',
        'code',
        'name',
        'description',
        'order_num',
    ];

    public function output()
    {
        return $this->belongsTo(ProjectOutput::class, 'output_id');
    }

    public function components()
    {
        return $this->hasMany(ActivityComponent::class, 'activity_id')->orderBy('order_num')->orderBy('id');
    }

    public function fundRequests()
    {
        return $this->hasMany(FundRequest::class, 'activity_id');
    }
}
