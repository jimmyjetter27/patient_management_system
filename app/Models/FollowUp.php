<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'frequency_of_cervical_monitoring', 'referrals', 'intervention_plan', 'scheduled_follow_up_date'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
