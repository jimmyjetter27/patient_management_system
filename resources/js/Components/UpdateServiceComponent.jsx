import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

const UpdateServiceComponent = ({ patientServiceId, existingServiceData, onClose }) => {
    const [formData, setFormData] = useState(existingServiceData || {});
    const { errors, put } = useForm();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            const file = files[0]; // Handle single file upload
            setFormData((prevData) => ({ ...prevData, [name]: file }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formPayload = new FormData();
        // Append each key in formData to FormData for sending as multipart/form-data
        Object.keys(formData).forEach((key) => {
            if (formData[key] instanceof File) {
                formPayload.append(key, formData[key]); // For files
            } else {
                formPayload.append(key, formData[key]); // For other form fields
            }
        });

        // Send a PUT request to update the service
        put(`/update-service/${patientServiceId}`, formPayload, {
            preserveScroll: true,
            onSuccess: () => {
                if (onClose) onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Update Service</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Object.keys(formData).map((key, index) => (
                    <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            {key.replace(/_/g, " ")}
                        </label>
                        {typeof formData[key] === "boolean" ? (
                            <input
                                type="checkbox"
                                name={key}
                                checked={formData[key]}
                                onChange={handleChange}
                                className="w-6 h-6 align-middle"
                            />
                        ) : key === "ultrasound_images" ? (
                            <input
                                type="file"
                                name={key}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <input
                                type="text"
                                name={key}
                                value={formData[key] || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Update
                </button>
            </div>
        </form>
    );
};

export default UpdateServiceComponent;
