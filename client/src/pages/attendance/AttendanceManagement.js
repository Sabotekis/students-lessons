import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const AttendanceManagement = () => {
    const [students, setStudents] = useState([]); 
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/students", { credentials: "include" })
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => {
                console.error("Error fetching students:", error);
                setStudents([]);
            });
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleAddAttendance = (studentId) => {
        navigate("/add-attendance", { state: { studentId } });
    };

    const handleViewAttendanceHistory = (id) => {
        navigate(`/view-attendance-history/${id}`);
    };

    const handelUploadFile = () => {
        navigate("/upload-attendance");
    };

    const handleAttendanceReport = () => {
        navigate("/attendance-report-management");
    };

    const handelAttendanceGroupReport = () => {
        navigate("/attendance-group-report-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("attendance_title")}</h1>
                </Col>
            </Row>

            <Row className="g-3">
                {students.map(student => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={student._id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("student_name")}:</strong> {student.name}</Card.Text>
                                <Card.Text><strong>{t("student_surname")}:</strong> {student.surname}</Card.Text>
                                <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode}</Card.Text>
                                <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</Card.Text>
                                <Card.Text><strong>{t("student_email")}:</strong> {student.email}</Card.Text>
                                <Card.Text><strong>{t("student_academic_hours")}:</strong> {student.totalAcademicHours}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-grid gap-2">
                                    <Button variant="success" onClick={() => handleViewAttendanceHistory(student._id)}>
                                        {t("attendance_history")}
                                    </Button>
                                    {hasPermission('attendances.create') && (
                                        <Button variant="success" onClick={() => handleAddAttendance(student._id)}>
                                            {t("attendance_add")}
                                        </Button>
                                    )}
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        {hasPermission('attendances.upload') && (
                            <Button variant="success" onClick={handelUploadFile} className="me-2">
                                {t("attendance_upload")}
                            </Button>
                        )}
                        <Button variant="success" onClick={handleAttendanceReport} className="me-2">
                            {t("attendance_report")}
                        </Button>
                        <Button variant="success" onClick={handelAttendanceGroupReport} className="me-2">
                            {t("attendance_group_report")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AttendanceManagement;