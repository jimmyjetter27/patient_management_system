<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Resources\PatientServiceResource;
use App\Models\Patient;
use App\Models\PatientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    public function updateMultiple(Request $request)
    {
        // Retrieve all request data except for _method
        $servicesData = $request->except('_method');  // This ignores the _method field

        try {
            foreach ($servicesData as $serviceId => $fields) {
                // Find the service by ID
                $service = PatientService::find($serviceId);

                if (!$service) {
                    return redirect()->back()->with(['error_message' => 'Service not found for ID: ' . $serviceId]);
                }

                // Decode the existing service data
                $serviceData = json_decode($service->service_data, true);

                // Update service data with new input from request
                foreach ($fields as $key => $value) {
                    if ($key !== 'ultrasound_images') { // Handle 'ultrasound_images' separately
                        $serviceData[$key] = $value;
                    }
                }

                // Handle file upload for `ultrasound_images` if present
                if ($request->hasFile("{$serviceId}.ultrasound_images")) {
                    try {
                        // Delete the old image
                        if (isset($serviceData['ultrasound_images']) && Storage::exists('public/' . $serviceData['ultrasound_images'])) {
                            Storage::delete('public/' . $serviceData['ultrasound_images']);
                        }

                        // Store the new file
                        $file = $request->file("{$serviceId}.ultrasound_images");
                        $filePath = $file->store('ultrasound_images', 'public'); // Store the file
                        $serviceData['ultrasound_images'] = $filePath;
                    } catch (\Exception $e) {
                        return redirect()->back()->with(['error_message' => 'File upload failed: ' . $e->getMessage()]);
                    }
                }

                // Update the service with the modified data
                $service->update([
                    'service_data' => json_encode($serviceData),  // Re-encode the service data as JSON
                ]);
            }

            return redirect()->back()->with(['success_message' => 'Services have been updated successfully']);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => 'Failed to update services: ' . $e->getMessage()]);
        }
    }



}
