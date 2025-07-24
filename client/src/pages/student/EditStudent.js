import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const EditStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState({ name: "", surname: "", personalCode: "", phoneNumber: "", email: "" });
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(response => response.json())
            .then(data => setStudent(data))
            .catch(error => console.error("Error fetching students:", error));
    }, [id]);

    const handleUpdateStudent = () => {
        const personalCodeRegex = /^\d{6}-?\d{5}$/;
        if (!student.name || !student.surname || !student.personalCode || !student.phoneNumber || !student.email) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (!personalCodeRegex.test(student.personalCode)) {
            alert("Personas kodam jābūt pareizā formātā");
            return;
        }
        if (student.phoneNumber.length !== 8) {
            alert("Tālruņa numuram jābūt 8 ciparu garam");
            return;
        }
        if (!student.email.includes("@")) {
            alert("E-pastam jābūt pareizā formātā");
            return;
        }
        fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/student-management");
        })
        .catch(error => console.error('Error updating student:', error));
    };

    const handleBack = () => {
        navigate("/view-student/" + id);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card>
                        <Card.Header className="text-center">
                            <h3>{t("edit_student_title")}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("student_name")}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={student.name}
                                                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("student_surname")}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={student.surname}
                                                onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("student_personal_code")}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={student.personalCode}
                                                onChange={(e) => setStudent({ ...student, personalCode: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("student_phone_number")}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={student.phoneNumber}
                                                onChange={(e) => setStudent({ ...student, phoneNumber: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("student_email")}</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={student.email}
                                                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                    <Button variant="success" onClick={handleUpdateStudent}>
                                        {t("update")}
                                    </Button>
                                    <Button variant="danger" onClick={handleBack}>
                                        {t("back")}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditStudent;