import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Function to convert both camelCase and snake_case to Headline Case
const convertToHeadlineCase = (string) => {
    return string
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case words
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

const PatientPrintComponent = React.forwardRef(({ patientName, services }, ref) => {
    return (
        <div ref={ref} className="printable-area">
            <div className="print-container">
                <div className="header">
                    <div className="logo-container">
                        <ApplicationLogo className="logo" />
                    </div>
                    <h1 className="patient-name">Patient Name: {convertToHeadlineCase(patientName)}</h1>
                </div>

                <h2 className="section-title">Services for Today:</h2>

                {/* Adding spacing between the title and the list */}
                <div style={{ marginBottom: '20px' }}></div>

                <ul className="services-list">
                    {services.map((service, index) => (
                        !service.service_type.includes('attachment') && (
                            <li key={index} className="service-item">
                                <strong>{convertToHeadlineCase(service.service_type)}:</strong>
                                {Object.keys(service.service_data).map((key) => {
                                    if (key.includes('images') || key.includes('attachment')) {
                                        return null; // Exclude attachments from being printed
                                    }
                                    return (
                                        <p key={key} className="service-detail">
                                            {convertToHeadlineCase(key)}: {service.service_data[key]}
                                        </p>
                                    );
                                })}

                                {/* Displaying the human-readable created_at date */}
                                {service.created_at && (
                                    <p className="service-detail">
                                        <strong>Service Created At:</strong> {service.created_at}
                                    </p>
                                )}
                            </li>
                        )
                    ))}
                </ul>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    .printable-area, .printable-area * {
                        visibility: visible;
                    }

                    .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }

                    .print-container {
                        text-align: center;
                        border: 1px solid #000;
                        padding: 20px;
                        max-width: 800px;
                        width: 100%;
                    }

                    .header {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .logo-container {
                        margin-bottom: 10px;
                    }

                    .logo {
                        max-width: 100px;
                    }

                    .patient-name {
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-top: 20px;
                        text-align: center;
                    }

                    .services-list {
                        list-style-type: none;
                        padding: 0;
                        max-height: 70vh; /* Restrict height for print */
                        overflow-y: auto;
                    }

                    .service-item {
                        margin-bottom: 10px;
                        font-size: 16px;
                    }

                    .service-detail {
                        margin-left: 20px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
});

export default PatientPrintComponent;
