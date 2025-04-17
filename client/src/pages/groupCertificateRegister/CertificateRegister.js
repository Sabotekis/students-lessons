import React, { useEffect, useState } from "react";
import './groupCertificate.css';
import { useNavigate } from "react-router-dom";


const CertificateRegister = () => {
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/certificates/register")
            .then(response => response.json())                
            .then(data => setCertificates(data))
            .catch(error => console.error("Error fetching group register data:", error));
    }, []);

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <div className="certificate-register-container">
            <h1 className="certificate-register-title">Apliecību Reģistrs</h1>
            <table className="certificate-register-table">
                <thead>
                    <tr>
                        <th>Nr.</th>
                        <th>Izglītības dokumenta veids</th>
                        <th>Izglītības dokumenta numurs</th>
                        <th>Vārds Uzvārds</th>
                        <th>Personas kods</th>
                        <th>Apgūtā izglītības programma</th>
                        <th>Mācību periods</th>
                        <th>Grupas numurs</th>
                        <th>Izsniegšanas datums</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map((certificate, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{certificate.certificateType}</td>
                            <td>{certificate.certificateNumber}</td>
                            <td>{certificate.studentName}</td>
                            <td>{certificate.personalCode}</td>
                            <td>{certificate.group}</td>
                            <td>{certificate.period}</td>
                            <td>{certificate.registerNumber}</td>
                            <td>{certificate.issueDate}</td>
                        </tr>
                    ))}
                </tbody>
                </table>    
            <button className="certificate-register-button" onClick={handleBack}>
                Atgriezties
            </button>
        </div>
    );
};

export default CertificateRegister;