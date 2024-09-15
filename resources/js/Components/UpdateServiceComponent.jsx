import React, { useEffect, useState } from "react";
import axios from 'axios';
import { router } from "@inertiajs/react";

const UpdateServiceComponent = ({ patientId, onClose }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceData, setSelectedServiceData] = useState({});
    const [updating, setUpdating] = useState(false);

    // Fetch patient services when the component mounts
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`/api/patient-services/${patientId}`);
                setServices(response.data.data || []);  // Ensure it's an array
            } catch (error) {
                console.error("Error fetching patient services:", error);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchServices();
        }
    }, [patientId]);

    // Handle form input changes
    const handleServiceChange = (serviceId, key, value) => {
        setSelectedServiceData(prevState => ({
            ...prevState,
            [serviceId]: {
                ...prevState[serviceId],
                [key]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        setUpdating(true);
        const formData = new FormData();

        try {
            // Loop through each service in `selectedServiceData`
            for (const serviceId in selectedServiceData) {
                const serviceData = selectedServiceData[serviceId];

                // Loop through each field in the service data
                for (const key in serviceData) {
                    const value = serviceData[key];

                    // If it's a file, append it as a file
                    if (value instanceof File) {
                        formData.append(`${serviceId}[${key}]`, value);
                    } else {
                        formData.append(`${serviceId}[${key}]`, value);
                    }
                }
            }

            formData.append('_method', 'put');

            // Send the PUT request to update the services
            router.post(`/update-services`, formData, {
                onSuccess: () => {
                    onClose();  // Close the modal after updating
                },
                preserveScroll: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        } catch (error) {
            console.error("Error updating services:", error);
        } finally {
            setUpdating(false);
        }
    };

    // Convert "true"/"false" strings to actual Booleans for checkbox rendering
    const getBooleanValue = (value) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;  // Return the value as-is for non-Boolean values
    };

    if (loading) {
        return <p className="text-gray-700 dark:text-gray-200 text-xl text-center p-6">Loading services...</p>;
    }

    if (!services || services.length === 0) {
        return <p className="text-gray-700 dark:text-gray-200 text-xl text-center p-6">No services found for this patient.</p>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Update Patient Services</h2>
            <div className="mt-4 space-y-4">
                {services.map((service) => (
                    service?.service_data ? (
                        <div key={service.id} className="border border-gray-300 p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                {service.service_type.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </h3>
                            <ul className="mt-2 text-gray-600 dark:text-gray-300">
                                {Object.entries(service?.service_data || {}).map(([key, value], index) => (
                                    <li key={index} className="mb-2">
                                        <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                        {key === 'patient_compliance' || typeof value === 'boolean' ? (
                                            <input
                                                type="checkbox"
                                                checked={getBooleanValue(value)}
                                                onChange={(e) =>
                                                    handleServiceChange(service.id, key, e.target.checked)
                                                }
                                                className="ml-2"
                                            />
                                        ) : typeof value === 'string' && (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png')) ? (
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={value}
                                                    alt="Uploaded attachment"
                                                    className="w-16 h-16 object-cover border rounded"
                                                />
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleServiceChange(service.id, key, e.target.files[0])
                                                    }
                                                    className="ml-2"
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                defaultValue={value}
                                                onChange={(e) =>
                                                    handleServiceChange(service.id, key, e.target.value)
                                                }
                                                className="border rounded p-2 ml-2 w-full text-gray-500"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded" disabled={updating}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded ms-3" disabled={updating}>
                    {updating ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );
};

export default UpdateServiceComponent;
