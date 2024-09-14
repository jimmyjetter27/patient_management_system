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

export default serviceForms;
