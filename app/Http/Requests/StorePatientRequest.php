<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'hospital_id' => 'required|string|max:255',
            'date_of_scan' => 'required|date',
            'gestational_age' => 'required|integer|min:0|max:40',
            'parity_gravidity' => 'required|string|max:255',
            'referring_physician' => 'required|string|max:255',

            'obstetric_history' => 'nullable|array',
            'current_pregnancy' => 'nullable|array',
            'scan_details' => 'nullable|array',
            'cervical_assessment' => 'nullable|array',
            'risk_assessment' => 'nullable|array',
            'interpretation_and_recommendations' => 'nullable|array',
            'follow_up' => 'nullable|array',
            'attachments' => 'nullable|array',
            'comments' => 'nullable|array',
            'signatures' => 'nullable|array',
        ];
    }
}
