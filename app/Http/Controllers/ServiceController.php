<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Resources\PatientServiceResource;
use App\Models\Patient;
use App\Models\PatientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function store(StoreServiceRequest $request, Patient $patient)
//    public function store(Request $request, Patient $patient)
    {
        Log::info('add services request: ' . json_encode($request->all()));

        return redirect()->back()->with(['success_message' => 'Service(s) added successfully']);
        if (!$patient) {
            return redirect()->back()->with(['error_message' => 'Patient not found']);
        }

        foreach ($request->input('services') as $service) {
            $serviceData = $service['service_data'] ?? [];

            // Log file info to check if it's being recognized
            if ($request->hasFile("services.{$service['service_type']}.ultrasound_images")) {
                Log::info('File found for service: ' . $service['service_type']);
            } else {
                Log::warning('No file found for service: ' . $service['service_type']);
            }

            // Handle file uploads for the "attachments" service
            if (isset($serviceData['ultrasound_images']) && $request->hasFile("services.{$service['service_type']}.ultrasound_images")) {
                $file = $request->file("services.{$service['service_type']}.ultrasound_images");
                $filePath = $file->store('ultrasound_images', 'public'); // Store the file in the public storage folder

                // Replace the file input in service_data with the file path
                $serviceData['ultrasound_images'] = $filePath;
            }

            // Store the service data
            PatientService::create([
                'patient_id' => $patient->id,
                'service_type' => $service['service_type'],
                'service_data' => json_encode($serviceData),  // Store the data as JSON
            ]);
        }

        return redirect()->back()->with(['success_message' => 'Service(s) added successfully']);
    }



    public function patientServices(Patient $patient)
    {
        return PatientServiceResource::collection($patient->services);
    }
}
