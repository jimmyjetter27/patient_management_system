import React, { useEffect, useState } from "react";
import axios from 'axios';

const PatientServices = ({ patientId }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch patient services when the component mounts
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`/api/patient-services/${patientId}`);
                setServices(response.data.data); // Assuming the data is inside `data`
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

    if (loading) {
        return <p className="text-gray-700 dark:text-gray-200 text-xl text-center p-6">Loading services...</p>;
    }

    if (services.length === 0) {
        return <p className="text-gray-700 dark:text-gray-200 text-xl text-center p-6">No services found for this patient.</p>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Patient Services</h2>
            <ul className="mt-4 space-y-4">
                {services.map(service => (
                    <li key={service.id} className="border border-gray-300 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {service.service_type.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </h3>
                        <ul className="mt-2 text-gray-600 dark:text-gray-300">
                            {Object.entries(service.service_data).map(([key, value], index) => (
                                <li key={index}>
                                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                    {/* Check if it's an image and render <img> */}
                                    {typeof value === 'string' && value.startsWith('/storage/') ? (
                                        <img
                                            src={value}
                                            alt="Uploaded attachment"
                                            className="mt-2 w-32 h-32 object-cover border rounded"
                                        />
                                    ) : (
                                        value || "N/A"
                                    )}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Created at: {service.created_at}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientServices;
