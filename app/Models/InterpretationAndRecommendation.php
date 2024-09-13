<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterpretationAndRecommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'cervical_length_interpretation', 'preventive_measures', 'patient_education_provided'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
