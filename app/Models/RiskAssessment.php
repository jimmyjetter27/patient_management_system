<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'risk_stratification', 'biomarkers_tests'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
