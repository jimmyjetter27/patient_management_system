<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'ultrasound_images'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
