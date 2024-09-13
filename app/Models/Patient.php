<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'age', 'hospital_id', 'date_of_scan', 'gestational_age', 'parity_gravidity', 'referring_physician'
    ];

    public function obstetricHistory()
    {
        return $this->hasOne(ObstetricHistory::class);
    }

    public function currentPregnancy()
    {
        return $this->hasOne(CurrentPregnancy::class);
    }

    public function scanDetails()
    {
        return $this->hasOne(ScanDetail::class);
    }

    public function cervicalAssessment()
    {
        return $this->hasOne(CervicalAssessment::class);
    }

    public function riskAssessment()
    {
        return $this->hasOne(RiskAssessment::class);
    }

    public function interpretationRecommendations()
    {
        return $this->hasOne(InterpretationAndRecommendation::class);
    }

    public function followUps()
    {
        return $this->hasMany(FollowUp::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function signatures()
    {
        return $this->hasOne(Signature::class);
    }
}
