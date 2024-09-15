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
//    public function store(StoreServiceRequest $request, Patient $patient)
    public function store(Request $request, Patient $patient)
    {
        if (!$patient) {
            return redirect()->back()->with(['error_message' => 'Patient not found']);
        }

        // Step 1: Handle attachments (specifically ultrasound_images)
        if (isset($request['services']['attachments'])) {
            $attachmentsService = $request['services']['attachments'];
            $serviceData = $attachmentsService['service_data'] ?? [];

            if (isset($serviceData['ultrasound_images'])) {
                $file = $serviceData['ultrasound_images'];

                if ($file instanceof \Illuminate\Http\UploadedFile) {
//                    Log::info('File found for service: ' . $attachmentsService['service_type']);

                    try {
                        // Store the file and update the service data with the file path
                        $filePath = $file->store('ultrasound_images', 'public');
                        $serviceData['ultrasound_images'] = $filePath;

                        // Store the attachment service in the database
                        PatientService::create([
                            'patient_id' => $patient->id,
                            'service_type' => $attachmentsService['service_type'],
                            'service_data' => json_encode($serviceData),  // Store the service data with the file path
                        ]);
                    } catch (\Exception $e) {
                        Log::error('File storage failed: ' . $e->getMessage());
                    }
                } else {
                    Log::warning('No valid file found for service: ' . $attachmentsService['service_type']);
                }
            }
        }

        // Step 2: Handle other services (excluding attachments)
        foreach ($request->input('services') as $serviceType => $service) {
            if ($serviceType !== 'attachments') {
                $serviceData = $service['service_data'] ?? [];

                // Store the other service data in the database
                PatientService::create([
                    'patient_id' => $patient->id,
                    'service_type' => $serviceType,
                    'service_data' => json_encode($serviceData),  // Store the other services as JSON
                ]);
            }
        }

        return redirect()->back()->with(['success_message' => 'Service(s) added successfully']);
    }


    public function patientServices(Patient $patient)
    {
        return PatientServiceResource::collection($patient->services);
    }

    public function update(Request $request, PatientService $service)
    {
        // Ensure the service exists
        if (!$service) {
            return redirect()->back()->with(['error_message' => 'Service not found']);
        }

        // Decode the existing service data
        $serviceData = json_decode($service->service_data, true);

        // Define the fields you expect in the request
        $fields = $request->except(['_method', '_token', 'ultrasound_images']);

        // Update the service data with any new input
        foreach ($fields as $key => $value) {
            $serviceData[$key] = $value;
        }

        // Handle file uploads separately (e.g., for ultrasound images)
        if ($request->hasFile('ultrasound_images')) {
            $file = $request->file('ultrasound_images');
            $filePath = $file->store('ultrasound_images', 'public'); // Save the file to public storage
            $serviceData['ultrasound_images'] = $filePath; // Update the file path in service data
        }

        // Update the service with the modified data
        $service->update([
            'service_data' => json_encode($serviceData),  // Re-encode the service data as JSON
        ]);

        return redirect()->back()->with(['success_message' => 'Service(s) has been updated successfully']);
    }

}
