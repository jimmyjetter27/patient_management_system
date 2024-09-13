<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScanDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'sonographer', 'ultrasound_machine_settings_used', 'transducer_type', 'patient_preparation'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
