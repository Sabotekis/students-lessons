import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const CertificateRegister = () => {
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("certificate_register")}</h1>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>{t("number")}</th>
                                    <th>{t("education_document_type")}</th>
                                    <th>{t("education_document_number")}</th>                                        <th>{t("name_and_surname")}</th>
                                    <th>{t("student_personal_code")}</th>
                                    <th>{t("education_program")}</th>
                                    <th>{t("period_of_study")}</th>
                                    <th>{t("group_number")}</th>
                                    <th>{t("issue_date")}</th>
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
                        </Table>
                    </div>
                </Col>
            </Row>
            
            <Row className="mb-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        <Button variant="danger" onClick={handleBack}>
                            {t("back")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CertificateRegister;