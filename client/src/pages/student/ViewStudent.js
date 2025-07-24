import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button,  } from 'react-bootstrap';

const ViewStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(response => response.json())
            .then(data => setStudent(data))
            .catch(error => console.error('Error fetching group:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission); 

    const handleEditStudent = () => {
        navigate(`/edit-student/${id}`);
    };

    const handleDeleteStudent = () => {
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            navigate("/student-management");
        })
        .catch(error => console.error('Error deleting group:', error));
    };

    const handleBack = () => {
        navigate("/student-management");
    };

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="mt-4">
            <Row >
                <Col xs={12}>
                    <div className="text-center mb-4">
                        <h1>{t("view_student_title")}</h1>
                    </div>
                </Col>
            </Row>

            {student && (
                <>
                    <Row className="d-flex justify-content-center mb-2">
                        <Col xs={12} lg={3} className="text-center">
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_name")}:</strong> {student.name}
                                        </Col>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_surname")}:</strong> {student.surname}
                                        </Col>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_personal_code")}:</strong> {student.personalCode}
                                        </Col>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_phone_number")}:</strong> {student.phoneNumber}
                                        </Col>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_email")}:</strong> {student.email}
                                        </Col>
                                        <Col xs={12} className="mb-3">
                                            <strong>{t("student_academic_hours")}:</strong> {student.totalAcademicHours}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            {student.groups.length === 0 ? (
                                <div></div>
                            ) : (
                                <div className="text-center mb-4">
                                    <h3><strong>{t("groups")}:</strong></h3>
                                </div>
                            )}
                        </Col>
                    </Row>

                    <Row className="g-3">
                        {student.groups.map((group) => (
                            <Col xs={12} sm={6} lg={4} key={group._id}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={12} className="mb-3">
                                                <strong>{t("group_name")}:</strong> {group.title}
                                            </Col>
                                            <Col xs={12} className="mb-3">
                                                <strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString()}
                                            </Col>
                                            <Col xs={12} className="mb-3">
                                                <strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString()}
                                            </Col>
                                            <Col xs={12} className="mb-3">
                                                <strong>{t("group_professor")}:</strong> {group.professor}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row className="mt-3">
                        <Col xs={12} className="text-center">
                            <div className="d-grid gap-2 d-md-block">
                                {hasPermission('students.update') && <Button variant="success" onClick={handleEditStudent} className="me-2">{t("edit")}</Button>}
                                {hasPermission('students.delete') && <Button variant="danger" onClick={handleDeleteStudent} className="me-2">{t("delete")}</Button>}
                                <Button variant="danger" onClick={handleBack} className="me-2">{t("back")}</Button>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ViewStudent;