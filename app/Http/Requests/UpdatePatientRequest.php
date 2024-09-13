<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer|min:0',
            'hospital_id' => 'sometimes|string|max:255',
            'date_of_scan' => 'sometimes|date',
            'gestational_age' => 'sometimes|integer|min:0|max:40',
            'parity_gravidity' => 'sometimes|string|max:255',
            'referring_physician' => 'sometimes|string|max:255',
            'attachments.ultrasound_images' => 'sometimes|file|mimes:jpg,jpeg,png|max:10240'
        ];
    }
}
