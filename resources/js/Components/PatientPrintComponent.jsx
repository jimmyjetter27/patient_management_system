import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const PatientPrintComponent = React.forwardRef(({ patientName, services }, ref) => {
    return (
        <div ref={ref} className="printable-area">
            <div className="header">
                <div className="logo-container">
                    <ApplicationLogo className="logo" />
                </div>
                <h1 className="patient-name">Patient Name: {patientName}</h1>
            </div>

            <h2 className="section-title">Services for Today:</h2>
            <ul className="services-list">
                {services.map((service, index) => (
                    !service.service_type.includes('attachment') && (
                        <li key={index} className="service-item">
                            <strong>{service.service_type}:</strong>
                            {Object.keys(service.service_data).map((key) => {
                                if (key.includes('images') || key.includes('attachment')) {
                                    return null; // Exclude attachments from being printed
                                }
                                return (
                                    <p key={key} className="service-detail">
                                        {key.replace(/_/g, ' ')}: {service.service_data[key]}
                                    </p>
                                );
                            })}
                        </li>
                    )
                ))}
            </ul>

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
                        max-width: 100px; /* Reduced size for better fit */
                    }

                    .patient-name {
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-top: 20px;
                        text-align: left;
                    }

                    .services-list {
                        list-style-type: none;
                        padding: 0;
                    }

                    .service-item {
                        margin-bottom: 10px;
                        font-size: 16px;
                    }

                    .service-detail {
                       h margin-left: 20px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
});

export default PatientPrintComponent;
