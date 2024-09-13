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
//    public function store(StorePatientRequest $request)
    public function store(Request $request)
    {
        Log::info('Store Patient Request: '. json_encode($request->all()));
        return redirect()->back()->with('success_message', 'Patient and services added successfully');
        $patient = Patient::create($request->only([
            'name',
            'age',
            'hospital_id',
            'date_of_scan',
            'gestational_age',
            'parity_gravidity',
            'referring_physician',
        ]));

        if ($request->has('obstetric_history')) {
            ObstetricHistory::create([
                'patient_id' => $patient->id,
                'history_of_preterm_birth' => $request->input('obstetric_history.history_of_preterm_birth'),
                'gestational_age_at_delivery' => $request->input('obstetric_history.gestational_age_at_delivery'),
                'previous_cervical_interventions' => $request->input('obstetric_history.previous_cervical_interventions'),
                'multiple_gestations' => $request->input('obstetric_history.multiple_gestations'),
                'uterine_anomalies' => $request->input('obstetric_history.uterine_anomalies'),
            ]);
        }

        if ($request->has('current_pregnancy')) {
            CurrentPregnancy::create([
                'patient_id' => $patient->id,
                'indication_for_screening' => $request->input('current_pregnancy.indication_for_screening'),
                'current_symptoms' => $request->input('current_pregnancy.current_symptoms'),
            ]);
        }

        if ($request->has('scan_details')) {
            ScanDetail::create([
                'patient_id' => $patient->id,
                'sonographer' => $request->input('scan_details.sonographer'),
                'ultrasound_machine_settings_used' => $request->input('scan_details.ultrasound_machine_settings_used'),
                'transducer_type' => $request->input('scan_details.transducer_type'),
                'patient_preparation' => $request->input('scan_details.patient_preparation'),
            ]);
        }

        if ($request->has('cervical_assessment')) {
            CervicalAssessment::create([
                'patient_id' => $patient->id,
                'cervical_length' => $request->input('cervical_assessment.cervical_length'),
                'internal_os_condition' => $request->input('cervical_assessment.internal_os_condition'),
                'external_os_condition' => $request->input('cervical_assessment.external_os_condition'),
                'cervical_consistency' => $request->input('cervical_assessment.cervical_consistency'),
                'presence_of_cervical_suture' => $request->input('cervical_assessment.presence_of_cervical_suture'),
                'amniotic_fluid_membrane_protrusion' => $request->input('cervical_assessment.amniotic_fluid_membrane_protrusion'),
            ]);
        }

        if ($request->has('risk_assessment')) {
            RiskAssessment::create([
                'patient_id' => $patient->id,
                'risk_stratification' => $request->input('risk_stratification'),
                'biomarkers_tests' => $request->input('biomarkers_tests')
            ]);
        }

        if ($request->has('interpretation_and_recommendations')) {
            InterpretationAndRecommendation::create([
                'patient_id' => $patient->id,
                'cervical_length_interpretation' => $request->input('interpretation_and_recommendations.cervical_length_interpretation'),
                'preventive_measures' => $request->input('interpretation_and_recommendations.preventive_measures'),
                'patient_education_provided' => $request->input('interpretation_and_recommendations.patient_education_provided'),
            ]);
        }

        if ($request->has('follow_up')) {
            CervicalAssessment::create([
                'patient_id' => $patient->id,
                'frequency_of_cervical_monitoring' => $request->input('follow_up.frequency_of_cervical_monitoring'),
                'referrals' => $request->input('follow_up.referrals'),
                'intervention_plan' => $request->input('follow_up.intervention_plan'),
                'scheduled_follow_up_date' => $request->input('follow_up.scheduled_follow_up_date'),
            ]);
        }

        if ($request->has('attachments')) {
            CervicalAssessment::create([
                'patient_id' => $patient->id,
                'ultrasound_images' => $request->input('attachments.ultrasound_images'),
            ]);
        }

        if ($request->has('comments')) {
            CervicalAssessment::create([
                'patient_id' => $patient->id,
                'additional_observations' => $request->input('comments.additional_observations'),
                'patient_compliance' => $request->input('comments.patient_compliance'),
            ]);
        }

        if ($request->has('signatures')) {
            CervicalAssessment::create([
                'patient_id' => $patient->id,
                'sonographer_signature' => $request->input('signatures.sonographer_signature'),
                'supervising_physician_signature' => $request->input('signatures.supervising_physician_signature'),
                'date' => $request->input('signatures.date'),
            ]);
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

        $patient->update($request->validated());

        // Obstetric History
        if ($request->has('obstetric_history')) {
            ObstetricHistory::updateOrCreate(
                ['patient_id' => $patient->id],  // Find the record by patient_id
                [
                    'history_of_preterm_birth' => $request->input('obstetric_history.history_of_preterm_birth'),
                    'gestational_age_at_delivery' => $request->input('obstetric_history.gestational_age_at_delivery'),
                    'previous_cervical_interventions' => $request->input('obstetric_history.previous_cervical_interventions'),
                    'multiple_gestations' => $request->input('obstetric_history.multiple_gestations'),
                    'uterine_anomalies' => $request->input('obstetric_history.uterine_anomalies'),
                ]
            );
        }

        // Current Pregnancy
        if ($request->has('current_pregnancy')) {
            CurrentPregnancy::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'indication_for_screening' => $request->input('current_pregnancy.indication_for_screening'),
                    'current_symptoms' => $request->input('current_pregnancy.current_symptoms'),
                ]
            );
        }

        // Scan Details
        if ($request->has('scan_details')) {
            ScanDetail::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'sonographer' => $request->input('scan_details.sonographer'),
                    'ultrasound_machine_settings_used' => $request->input('scan_details.ultrasound_machine_settings_used'),
                    'transducer_type' => $request->input('scan_details.transducer_type'),
                    'patient_preparation' => $request->input('scan_details.patient_preparation'),
                ]
            );
        }

        // Cervical Assessment
        if ($request->has('cervical_assessment')) {
            CervicalAssessment::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'cervical_length' => $request->input('cervical_assessment.cervical_length'),
                    'internal_os_condition' => $request->input('cervical_assessment.internal_os_condition'),
                    'external_os_condition' => $request->input('cervical_assessment.external_os_condition'),
                    'cervical_consistency' => $request->input('cervical_assessment.cervical_consistency'),
                    'presence_of_cervical_suture' => $request->input('cervical_assessment.presence_of_cervical_suture'),
                    'amniotic_fluid_membrane_protrusion' => $request->input('cervical_assessment.amniotic_fluid_membrane_protrusion'),
                ]
            );
        }

        // Risk Assessment
        if ($request->has('risk_assessment')) {
            RiskAssessment::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'risk_stratification' => $request->input('risk_assessment.risk_stratification'),
                    'biomarkers_tests' => $request->input('risk_assessment.biomarkers_tests'),
                ]
            );
        }

        // Interpretation and Recommendations
        if ($request->has('interpretation_and_recommendations')) {
            InterpretationAndRecommendation::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'cervical_length_interpretation' => $request->input('interpretation_and_recommendations.cervical_length_interpretation'),
                    'preventive_measures' => $request->input('interpretation_and_recommendations.preventive_measures'),
                    'patient_education_provided' => $request->input('interpretation_and_recommendations.patient_education_provided'),
                ]
            );
        }

        // Follow Up
        if ($request->has('follow_up')) {
            FollowUp::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'frequency_of_cervical_monitoring' => $request->input('follow_up.frequency_of_cervical_monitoring'),
                    'referrals' => $request->input('follow_up.referrals'),
                    'intervention_plan' => $request->input('follow_up.intervention_plan'),
                    'scheduled_follow_up_date' => $request->input('follow_up.scheduled_follow_up_date'),
                ]
            );
        }

        // Attachments
        if ($request->has('attachments')) {
            Attachment::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'ultrasound_images' => $request->input('attachments.ultrasound_images'),
                ]
            );
        }

        // Comments
        if ($request->has('comments')) {
            Comment::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'additional_observations' => $request->input('comments.additional_observations'),
                    'patient_compliance' => $request->input('comments.patient_compliance'),
                ]
            );
        }

        // Signatures
        if ($request->has('signatures')) {
            Signature::updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'sonographer_signature' => $request->input('signatures.sonographer_signature'),
                    'supervising_physician_signature' => $request->input('signatures.supervising_physician_signature'),
                    'date' => $request->input('signatures.date'),
                ]
            );
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
