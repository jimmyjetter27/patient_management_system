<?php

namespace App\Http\Controllers;

use App\Http\Resources\PatientResource;
use App\Models\Attachment;
use App\Models\CervicalAssessment;
use App\Models\Comment;
use App\Models\CurrentPregnancy;
use App\Models\FollowUp;
use App\Models\InterpretationAndRecommendation;
use App\Models\ObstetricHistory;
use App\Models\Patient;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\PatientService;
use App\Models\RiskAssessment;
use App\Models\ScanDetail;
use App\Models\Signature;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = QueryBuilder::for(Patient::class)
            ->allowedFilters(['name'])
            ->latest()
            ->paginate($request->per_page ?? 15);
        return PatientResource::collection($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientRequest $request)
    {
        // Log the incoming request data
        Log::info('Store Patient Request: ' . json_encode($request->all()));

        // Create a new patient record
        $patient = Patient::create($request->only([
            'name',
            'age',
            'hospital_id',
            'date_of_scan',
            'gestational_age',
            'parity_gravidity',
            'referring_physician',
        ]));

        // Define all services and their respective models and fields
        $services = [
            'obstetric_history' => [
                'fields' => [
                    'history_of_preterm_birth',
                    'gestational_age_at_delivery',
                    'previous_cervical_interventions',
                    'multiple_gestations',
                    'uterine_anomalies',
                ]
            ],
            'current_pregnancy' => [
                'fields' => [
                    'indication_for_screening',
                    'current_symptoms'
                ]
            ],
            'scan_details' => [
                'fields' => [
                    'sonographer',
                    'ultrasound_machine_settings_used',
                    'transducer_type',
                    'patient_preparation'
                ]
            ],
            'cervical_assessment' => [
                'fields' => [
                    'cervical_length',
                    'internal_os_condition',
                    'external_os_condition',
                    'cervical_consistency',
                    'presence_of_cervical_suture',
                    'amniotic_fluid_membrane_protrusion'
                ]
            ],
            'risk_assessment' => [
                'fields' => [
                    'risk_stratification',
                    'biomarkers_tests'
                ]
            ],
            'interpretation_and_recommendations' => [
                'fields' => [
                    'cervical_length_interpretation',
                    'preventive_measures',
                    'patient_education_provided'
                ]
            ],
            'follow_up' => [
                'fields' => [
                    'frequency_of_cervical_monitoring',
                    'referrals',
                    'intervention_plan',
                    'scheduled_follow_up_date'
                ]
            ],
            'attachments' => [
                'fields' => [
                    'ultrasound_images'
                ]
            ],
            'comments' => [
                'fields' => [
                    'additional_observations',
                    'patient_compliance'
                ]
            ],
            'signatures' => [
                'fields' => [
                    'sonographer_signature',
                    'supervising_physician_signature',
                    'date'
                ]
            ]
        ];

        // Handle file uploads separately for attachments
        if ($request->hasFile('attachments.ultrasound_images')) {
            $file = $request->file('attachments.ultrasound_images');
            $filePath = $file->store('ultrasound_images', 'public'); // Store the image in the storage folder
            $request->merge(['attachments' => ['ultrasound_images' => $filePath]]);
        }

        // Process each service and store the corresponding data
        foreach ($services as $serviceKey => $serviceInfo) {
            $serviceData = [];

            // If there's data for this service in the request, process it
            if ($request->has($serviceKey) && !empty(array_filter($request->input($serviceKey)))) {
                foreach ($serviceInfo['fields'] as $field) {
                    $serviceData[$field] = $request->input("{$serviceKey}.{$field}");
                }

                // Store the service in the `patient_services` table
                PatientService::create([
                    'patient_id' => $patient->id,
                    'service_type' => $serviceKey,
                    'service_data' => json_encode($serviceData),
                ]);
            }
        }

        return redirect()->back()->with('success_message', 'Patient and services added successfully');
    }



    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        // Update patient basic information
        $patient->update($request->validated());

        // Define all services and their respective models and fields
        $services = [
            'obstetric_history' => [
                'model' => ObstetricHistory::class,
                'fields' => [
                    'history_of_preterm_birth',
                    'gestational_age_at_delivery',
                    'previous_cervical_interventions',
                    'multiple_gestations',
                    'uterine_anomalies',
                ]
            ],
            'current_pregnancy' => [
                'model' => CurrentPregnancy::class,
                'fields' => [
                    'indication_for_screening',
                    'current_symptoms'
                ]
            ],
            'scan_details' => [
                'model' => ScanDetail::class,
                'fields' => [
                    'sonographer',
                    'ultrasound_machine_settings_used',
                    'transducer_type',
                    'patient_preparation'
                ]
            ],
            'cervical_assessment' => [
                'model' => CervicalAssessment::class,
                'fields' => [
                    'cervical_length',
                    'internal_os_condition',
                    'external_os_condition',
                    'cervical_consistency',
                    'presence_of_cervical_suture',
                    'amniotic_fluid_membrane_protrusion'
                ]
            ],
            'risk_assessment' => [
                'model' => RiskAssessment::class,
                'fields' => [
                    'risk_stratification',
                    'biomarkers_tests'
                ]
            ],
            'interpretation_and_recommendations' => [
                'model' => InterpretationAndRecommendation::class,
                'fields' => [
                    'cervical_length_interpretation',
                    'preventive_measures',
                    'patient_education_provided'
                ]
            ],
            'follow_up' => [
                'model' => FollowUp::class,
                'fields' => [
                    'frequency_of_cervical_monitoring',
                    'referrals',
                    'intervention_plan',
                    'scheduled_follow_up_date'
                ]
            ],
            'attachments' => [
                'model' => Attachment::class,
                'fields' => [
                    'ultrasound_images'
                ]
            ],
            'comments' => [
                'model' => Comment::class,
                'fields' => [
                    'additional_observations',
                    'patient_compliance'
                ]
            ],
            'signatures' => [
                'model' => Signature::class,
                'fields' => [
                    'sonographer_signature',
                    'supervising_physician_signature',
                    'date'
                ]
            ]
        ];

        // Handle each service, including file uploads for attachments
        foreach ($services as $serviceKey => $serviceInfo) {
            // If there's data for the service, process it
            if ($request->has($serviceKey) && !empty(array_filter($request->input($serviceKey)))) {
                $serviceData = [];

                // Handle file uploads separately
                if ($serviceKey === 'attachments' && $request->hasFile('attachments.ultrasound_images')) {
                    $file = $request->file('attachments.ultrasound_images');
                    $filePath = $file->store('ultrasound_images', 'public');
                    $serviceData['ultrasound_images'] = $filePath;
                } else {
                    // Gather non-file data
                    foreach ($serviceInfo['fields'] as $field) {
                        $serviceData[$field] = $request->input("{$serviceKey}.{$field}");
                    }
                }

                // Update or create the service record if data exists
                $serviceInfo['model']::updateOrCreate(
                    ['patient_id' => $patient->id],
                    $serviceData
                );
            } else {
                // If there's no valid data for the service, consider deleting existing record
                $serviceInfo['model']::where('patient_id', $patient->id)->delete();
            }
        }

        return redirect()->back()->with('success_message', 'Patient and services updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->back()->with('success_message', 'Patient deleted successfully');
    }
}
