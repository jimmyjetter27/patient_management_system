<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'additional_observations', 'patient_compliance'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
