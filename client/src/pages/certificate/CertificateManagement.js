import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CertificateManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

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
        //             {certificates.map((certificate) => (
        //                 <div className="certificate-management-card" key={certificate._id}>
        //                     <div><strong>{t("student_name")}:</strong> {certificate.student.name} </div>
        //                     <div><strong>{t("student_surname")}</strong> {certificate.student.surname}</div>
        //                     <div><strong>{t("group")}:</strong> {certificate.group.title}</div>
        //                     <div><strong>{t("issue_date")}:</strong> {new Date(certificate.issueData).toLocaleDateString()}</div>
        //                     {hasPermission('certificates.download') && (
        //                         <div>
        //                             <button className="certificate-management-button" onClick={() => handleDownloadPDF(certificate._id)}>{t("download_pdf")}</button>
        //                         </div>
        //                     )}
        //                 </div>
        //             ))}
        //             {hasPermission('certificates.create') && (
        //                 <div className="certificate-management-addbuttoncard">
        //                         <button className="certificate-management-button" onClick={handleAddCertificate}>{t("certificate_add")}</button>
        //                 </div>
        //             )}


        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("certificate_title")}</h1>
                </Col>
            </Row>

            <Row className="g-3">
                {certificates.map(certificate => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={certificate._id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("student_name")}:</strong> {certificate.student.name}</Card.Text>
                                <Card.Text><strong>{t("student_surname")}:</strong> {certificate.student.surname}</Card.Text>
                                <Card.Text><strong>{t("group")}:</strong> {certificate.group.title}</Card.Text>
                                <Card.Text><strong>{t("issue_date")}:</strong> {new Date(certificate.issueData).toLocaleDateString()}</Card.Text>
                                {hasPermission('certificates.download') && (
                                    <Button variant="success" onClick={() => handleDownloadPDF(certificate._id)}>{t("download_pdf")}</Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {hasPermission('certificates.create') && (
                    <Col xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100">
                            <Card.Body className="d-flex align-items-center justify-content-center text-center">
                                <Button variant="success" size="lg" onClick={handleAddCertificate}>
                                    {t("certificate_add")}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default CertificateManagement;