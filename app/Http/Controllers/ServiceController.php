<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Models\Patient;
use App\Models\PatientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function store(StoreServiceRequest $request, Patient $patient)
    {
        Log::info('patient: '. $patient->name);
        Log::info('add services request: '. json_encode($request->all()));
        if (!$patient) {
            return redirect()->back()->with(['error_message' => 'Patient not found']);
        }

        PatientService::create([
            'patient_id' => $patient->id,
            'service_type' => $request->input('service_type'),
            'service_data' => json_encode($request->input('service_data')),
        ]);

        return redirect()->back()->with(['success_message' => 'Service added successfully']);
    }
}
