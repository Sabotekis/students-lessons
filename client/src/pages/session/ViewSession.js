import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const ViewSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => response.json())
            .then(data => setSession(data))
            .catch(error => console.error('Error fetching session:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleBack = () => {
        navigate("/session-management");
    };

    if (!session) {
        return (
            <Container fluid className="mt-4">
                <div className="text-center">Loading...</div>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <div className="text-center mb-4">
                        <h1>{t("view_session_title")}</h1>
                    </div>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <div className="mb-2">
                                <strong>{t("session_start_date")}:</strong> {new Date(session.startDateTime).toLocaleString()}
                            </div>
                            <div className="mb-2">
                                <strong>{t("session_end_date")}:</strong> {new Date(session.endDateTime).toLocaleString()}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">{t("group")}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_register_number")}:</strong> {session.group.registerNumber}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_name")}:</strong> {session.group.title}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_start_date")}:</strong> {new Date(session.group.startDate).toLocaleDateString()}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_end_date")}:</strong> {new Date(session.group.endDate).toLocaleDateString()}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_professor")}:</strong> {session.group.professor}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_academic_hours")}:</strong> {session.group.academicHours}
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <strong>{t("group_min_hours")}:</strong> {session.group.minHours}
                                </Col>
                                <Col xs={12} >
                                    <strong>{t("group_planned_data")}:</strong>
                                    <div className="mt-1">
                                        {Object.entries(session.group.plannedData).map(([month, data]) => (
                                            <div key={month} className="mb-1">
                                                <strong>{month}:</strong> {data.days} {t("days")}, {data.hours} {t("hours")}
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {session.students.length > 0 && (
                <>
                    <Row>
                        <Col xs={12}>
                            <div className="text-center mb-4">
                                <h3><strong>{t("students")}:</strong></h3>
                            </div>
                        </Col>
                    </Row>

                    <Row className="g-3 mb-4">
                        {session.students.map(student => {
                            const hasAttendance = session.attendances.some(attendance => 
                                attendance.student && attendance.student._id === student._id
                            );

                            return (
                                <Col xs={12} sm={6} lg={4} xl={3} key={student._id}>
                                    <Card className={`h-100 ${hasAttendance ? 'border-success' : 'border-danger'}`}>
                                        <Card.Body>
                                            <Card.Text><strong>{t("student_name")}:</strong> {student.name}</Card.Text>
                                            <Card.Text><strong>{t("student_surname")}:</strong> {student.surname}</Card.Text>
                                            <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode}</Card.Text>
                                            <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</Card.Text>
                                            <Card.Text><strong>{t("student_email")}:</strong> {student.email}</Card.Text>
                                            {student.deleted && (
                                                <Card.Text className="text-muted">({t("student_deleted")})</Card.Text>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </>
            )}

            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        {!session.finished && (
                            <>
                                {hasPermission('sessions.update') && (
                                    <Button variant="success" onClick={() => navigate(`/edit-session/${id}`)} className="me-2">
                                        {t("edit")}
                                    </Button>
                                )}
                                {hasPermission('sessions.delete') && (
                                    <Button variant="danger" onClick={() => {
                                        fetch(`/api/sessions/${id}`, { method: "DELETE" })
                                            .then(() => navigate("/session-management"));
                                    }} className="me-2">
                                        {t("delete")}
                                    </Button>
                                )}
                            </>
                        )}
                        <Button variant="danger" onClick={handleBack} className="me-2">
                            {t("back")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewSession;