<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'sonographer_signature', 'supervising_physician_signature', 'date'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
