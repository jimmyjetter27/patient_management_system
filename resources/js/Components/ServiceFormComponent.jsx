import React, { useEffect, useState } from "react";

const serviceForms = {
    obstetricHistory: [
        {name: "history_of_preterm_birth", label: "History of Preterm Birth", type: "checkbox"},
        {name: "gestational_age_at_delivery", label: "Gestational Age at Delivery", type: "number"},
        {name: "previous_cervical_interventions", label: "Previous Cervical Interventions", type: "text"},
        {name: "multiple_gestations", label: "Multiple Gestations", type: "checkbox"},
        {name: "uterine_anomalies", label: "Uterine Anomalies", type: "text"},
    ],
    currentPregnancy: [
        {name: "indication_for_screening", label: "Indication for Screening", type: "text"},
        {name: "current_symptoms", label: "Current Symptoms", type: "text"},
    ],
    scanDetails: [
        {name: "sonographer", label: "Sonographer", type: "text"},
        {name: "ultrasound_machine_settings_used", label: "Ultrasound Machine Settings", type: "text"},
        {name: "transducer_type", label: "Transducer Type", type: "text"},
        {name: "patient_preparation", label: "Patient Preparation", type: "text"},
    ],
    cervicalAssessment: [
        {name: "cervical_length", label: "Cervical Length (mm)", type: "number"},
        {name: "internal_os_condition", label: "Internal OS Condition", type: "text"},
        {name: "external_os_condition", label: "External OS Condition", type: "text"},
        {name: "cervical_consistency", label: "Cervical Consistency", type: "text"},
        {name: "presence_of_cervical_suture", label: "Presence of Cervical Suture", type: "checkbox"},
        {name: "amniotic_fluid_membrane_protrusion", label: "Amniotic Fluid Membrane Protrusion", type: "checkbox"},
    ],
    riskAssessment: [
        {name: "risk_stratification", label: "Risk Stratification", type: "text"},
        {name: "biomarkers_tests", label: "Biomarkers Tests", type: "text"},
    ],
    interpretationAndRecommendations: [
        {name: "cervical_length_interpretation", label: "Cervical Length Interpretation", type: "text"},
        {name: "preventive_measures", label: "Preventive Measures", type: "text"},
        {name: "patient_education_provided", label: "Patient Education Provided", type: "text"},
    ],
    followUp: [
        {name: "frequency_of_cervical_monitoring", label: "Frequency of Cervical Monitoring", type: "text"},
        {name: "referrals", label: "Referrals", type: "text"},
        {name: "intervention_plan", label: "Intervention Plan", type: "text"},
        {name: "scheduled_follow_up_date", label: "Scheduled Follow-Up Date", type: "date"},
    ],
    attachments: [
        {name: "ultrasound_images", label: "Ultrasound Images", type: "file"},
    ],
    comments: [
        {name: "additional_observations", label: "Additional Observations", type: "text"},
        {name: "patient_compliance", label: "Patient Compliance", type: "checkbox"},
    ],
    signatures: [
        {name: "sonographer_signature", label: "Sonographer Signature", type: "text"},
        {name: "supervising_physician_signature", label: "Supervising Physician Signature", type: "text"},
        {name: "date", label: "Date", type: "date"},
    ],
};

const ServiceFormComponent = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(() => {
        const savedFormData = localStorage.getItem("serviceFormData");
        return savedFormData ? JSON.parse(savedFormData) : {};
    });
    const [selectedService, setSelectedService] = useState(() => {
        const savedService = localStorage.getItem("selectedService");
        return savedService || "obstetricHistory";
    });

    // Load the saved service and form data from localStorage when the component mounts
    useEffect(() => {
        const savedFormData = localStorage.getItem("serviceFormData");
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            setFormData(parsedData[selectedService] || {}); // Load only the formData for the selected service
        }
    }, [selectedService]);



    // Save the selected service and form data to localStorage whenever they change
    // useEffect(() => {
    //     const savedFormData = localStorage.getItem("serviceFormData");
    //     const parsedData = savedFormData ? JSON.parse(savedFormData) : {};
    //     parsedData[selectedService] = formData; // Save the specific service's form data
    //     localStorage.setItem("serviceFormData", JSON.stringify(parsedData));
    // }, [formData, selectedService]);





    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        };
        setFormData(updatedFormData);

        // Save the updated form data for the selected service in localStorage
        const savedFormData = localStorage.getItem("serviceFormData");
        const parsedData = savedFormData ? JSON.parse(savedFormData) : {};
        parsedData[selectedService] = updatedFormData;
        localStorage.setItem("serviceFormData", JSON.stringify(parsedData));
    };


    // console.log('serviceFormData : ', formData);


    // Handle switching service type
    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        localStorage.setItem("selectedService", e.target.value); // Save selected service to localStorage
    };

    // Handle form submission
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     onSubmit(formData); // Pass the current form data to the parent component
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Retrieve all saved service data from localStorage and pass it to the parent component
        const allServiceData = localStorage.getItem("serviceFormData");
        const parsedData = allServiceData ? JSON.parse(allServiceData) : {};

        onSubmit(parsedData); // Pass all service data to the parent component
    };

    const formatLabel = (label) => {
        return label
            .replace(/([A-Z])/g, " $1") // Add a space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    };

    return (
        <div>
            {/* Dropdown to choose service type */}
            <div className="w-64 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Choose Service Type:
                </label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedService}
                    onChange={handleServiceChange}
                >
                    {Object.keys(serviceForms).map((service, index) => (
                        <option key={index} value={service}>
                            {formatLabel(service)}
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {serviceForms[selectedService]?.map((field, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {field.label}
                            </label>
                            {field.type === "checkbox" ? (
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    checked={!!formData[field.name]} // Ensure checkbox is handled correctly
                                    onChange={handleChange}
                                    className="w-6 h-6 align-middle"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""} // Ensure text/number fields are handled correctly
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required={field.type !== "file"}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceFormComponent;
