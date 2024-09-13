<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrentPregnancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'indication_for_screening', 'current_symptoms'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
