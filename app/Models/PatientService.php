<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientService extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'service_type', 'service_data'];

    protected $casts = [
        'service_data' => 'array',
    ];
}
