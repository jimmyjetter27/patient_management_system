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
            'services' => 'required|array', // Ensure that "services" is an array
            'services.*.service_type' => 'required|string|in:obstetricHistory,currentPregnancy,scanDetails,cervicalAssessment,riskAssessment,interpretationAndRecommendations,followUp,attachments,comments,signatures',
            'services.*.service_data' => 'required|array', // Validate each service_data as an array
            'services.*.service_data.*' => 'nullable',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'services.required' => 'At least one service must be provided.',
            'services.*.service_type.required' => 'Each service must have a type.',
            'services.*.service_type.in' => 'Invalid service type.',
            'services.*.service_data.required' => 'Each service must have data.',
        ];
    }
}
