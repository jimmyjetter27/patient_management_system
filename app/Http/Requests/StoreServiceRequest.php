<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'service_type' => 'required|string|in:obstetric_history,current_pregnancy,scan_details,cervical_assessment,risk_assessment,interpretation_and_recommendations,follow_up,attachments,comments,signatures',
            'service_data' => 'required|array',
            'service_data.*' => 'nullable|string',
        ];
    }
}
