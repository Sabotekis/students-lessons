import React, { useState, useEffect } from 'react';
import './certificate.css';
import { useNavigate } from 'react-router-dom';

const CertificateManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        fetch('/api/certificates')
            .then((res) => res.json())
            .then((data) => setCertificates(data));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, []);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleAddCertificate = () => {
        navigate('/add-certificate');
    };

    const handleDownloadPDF = async (certificateId) => {
        try {
            const response = await fetch(`/api/certificates/${certificateId}/download-pdf`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificate_${certificateId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('An error occurred while downloading the PDF.');
        }
    };

    return (
        <div className="certificate-management-container">
            <h1 className="certificate-management-title">Apliecību pārvaldība</h1>
            <div>
                <div className="certificate-management-grid">
                    {certificates.map((certificate) => (
                        <div className="certificate-management-card" key={certificate._id}>
                            <div><strong>Vārds:</strong> {certificate.student.name} </div>
                            <div><strong>Uzvārds</strong> {certificate.student.surname}</div>
                            <div><strong>Grupa:</strong> {certificate.group.title}</div>
                            <div><strong>Izsniegšanas datums:</strong> {new Date(certificate.issueData).toLocaleDateString()}</div>
                            {hasPermission('certificates.download') && (
                                <div>
                                    <button className="certificate-management-button" onClick={() => handleDownloadPDF(certificate._id)}>Lejupielādēt PDF</button>
                                </div>
                            )}
                        </div>
                    ))}
                    {hasPermission('certificates.create') && (
                        <div className="certificate-management-addbuttoncard">
                                <button className="certificate-management-button" onClick={handleAddCertificate}>Pievienot apliecību</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificateManagement;