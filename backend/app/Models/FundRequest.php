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
        'outcome_id',
        'output_id',
        'activity_id',
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

    public function outcome()
    {
        return $this->belongsTo(ProjectOutcome::class, 'outcome_id');
    }

    public function output()
    {
        return $this->belongsTo(ProjectOutput::class, 'output_id');
    }

    public function activity()
    {
        return $this->belongsTo(ProjectActivity::class, 'activity_id');
    }
}
