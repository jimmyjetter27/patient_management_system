<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'age' => $this->age,
            'hospital_id' => $this->hospital_id,
            'date_of_scan' => $this->date_of_scan,
            'gestational_age' => $this->gestational_age,
            'parity_gravidity' => $this->parity_gravidity,
            'referring_physician' => $this->referring_physician,
            'created_at' => $this->created_at
        ];
    }
}
