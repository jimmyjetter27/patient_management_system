import React, { useState } from "react";
import serviceForms from "@/serviceForms.js";
import { router, usePage } from "@inertiajs/react";

const AddServiceComponent = ({ patientId, patientName, onSubmit }) => {
    const [services, setServices] = useState({});
    const [serviceType, setServiceType] = useState("obstetricHistory");
    const { errors } = usePage().props; // Validation errors from the server

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0]; // Handle single file upload
            setServices((prevServices) => ({
                ...prevServices,
                [serviceType]: {
                    ...prevServices[serviceType],
                    [name]: file, // Store the file in the service data
                },
            }));
        } else {
            setServices((prevServices) => ({
                ...prevServices,
                [serviceType]: {
                    ...prevServices[serviceType],
                    [name]: type === "checkbox" ? checked : value,
                },
            }));
        }
    };

    // Handle form submission
    const submitService = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Iterate over services and append each service data with service_type and service_data
        Object.keys(services).forEach((serviceType) => {
            const serviceData = services[serviceType];

            // Append each key-value pair in service_data to FormData
            Object.keys(serviceData).forEach((key) => {
                if (serviceData[key] instanceof File) {
                    formData.append(`services[${serviceType}][${key}]`, serviceData[key]);
                } else {
                    formData.append(`services[${serviceType}][${key}]`, serviceData[key] || "");
                }
            });

            // Ensure the service_type is appended properly
            formData.append(`services[${serviceType}][service_type]`, serviceType);
        });

        // Log the FormData to inspect what's being sent
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        // Submit using Inertia.js router with formData
        router.post(`/add-service/${patientId}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                onSubmit();
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };


    return (
        <div>
            <h1 className="text-center text-xl font-bold text-gray-700 dark:text-gray-200">
                Add Service(s) for {patientName}
            </h1>

            <form onSubmit={submitService} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Select Service Type:
                </label>
                <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    {Object.keys(serviceForms).map((service, index) => (
                        <option key={index} value={service}>
                            {service.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </option>
                    ))}
                </select>

                <div className="grid grid-cols-2 gap-5">
                    {serviceForms[serviceType].map((field, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {field.label}
                            </label>
                            {field.type === "checkbox" ? (
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    checked={!!(services[serviceType]?.[field.name] || false)}
                                    onChange={handleChange}
                                    className="w-6 h-6 align-middle"
                                />
                            ) : field.type === "file" ? (
                                <input
                                    type="file"
                                    name={field.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={services[serviceType]?.[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required={field.type !== "file"}
                                />
                            )}

                            {/* Display validation error for the specific field */}
                            {errors[`services.${serviceType}.service_data.${field.name}`] && (
                                <span className="text-red-500 text-sm">
                                    {errors[`services.${serviceType}.service_data.${field.name}`]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                    Submit Service(s)
                </button>
            </form>
        </div>
    );
};

export default AddServiceComponent;
