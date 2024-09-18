<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PatientServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $serviceData = json_decode($this->service_data, true);

        // Handle attachments (like ultrasound_images) and convert them to accessible URLs
        if (isset($serviceData['ultrasound_images'])) {
            $serviceData['ultrasound_images'] = Storage::url($serviceData['ultrasound_images']);
        }

        return [
            'id' => $this->id,
            'service_type' => $this->service_type,
            'service_data' => $serviceData, // Return the updated service data
            'created_at' => $this->created_at->format('M j, Y, g:i a'),
            'updated_at' => $this->updated_at->format('M j, Y, g:i a'),
        ];
    }
}
