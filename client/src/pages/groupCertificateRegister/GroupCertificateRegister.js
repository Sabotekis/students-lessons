import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Button } from 'react-bootstrap';



const GroupCertificateRegister = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGroupRegister = () => {
        navigate("/group-register-management");
    };

    const handleCertificateRegister = () => {
        navigate("/certificate-register");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("group_and_certificate_register_title")}</h1>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        <Button variant="success" onClick={handleGroupRegister} className="me-2">
                            {t("group_register")}
                        </Button>
                        <Button variant="success" onClick={handleCertificateRegister} className="me-2">
                            {t("certificate_register")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default GroupCertificateRegister;