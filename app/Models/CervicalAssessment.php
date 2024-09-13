<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CervicalAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'cervical_length', 'internal_os_condition', 'external_os_condition', 'cervical_consistency', 'presence_of_cervical_suture', 'amniotic_fluid_membrane_protrusion'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
