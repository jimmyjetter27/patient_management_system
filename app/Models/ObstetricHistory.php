<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObstetricHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'history_of_preterm_birth', 'gestational_age_at_delivery', 'previous_cervical_interventions', 'multiple_gestations', 'uterine_anomalies'
    ];

    // Belongs to a patient
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
