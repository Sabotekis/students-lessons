import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const ViewAttendanceHistory = () => {
    const { id } = useParams();
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/attendance/history/${id}`, { credentials: "include" })
            .then(response => response.json())
            .then(data => setAttendances(data))
            .catch(error => console.error("Error fetching students:", error));
    }, [id]);

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">
                        {t("attendance_history_title")}
                    </h1>
                </Col>
            </Row>

            <Row className="g-3">
                {attendances.length === 0 ? (
                    <Col xs={12}>
                        <div className="text-center p-4">{t("no_attendance_records")}</div>
                    </Col>
                ) : (
                    attendances.map(attendance => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={attendance._id}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <Card.Text><strong>{t("session_start_date")}:</strong> {new Date(attendance.session.startDateTime).toLocaleString()}</Card.Text> 
                                    <Card.Text><strong>{t("session_end_date")}</strong> {new Date(attendance.session.endDateTime).toLocaleString()}</Card.Text>
                                    <Card.Text><strong>{t("group")}:</strong> {attendance.session.group?.title || "N/A"}</Card.Text>
                                    <Card.Text><strong>{t("time_minute")}:</strong> {attendance.timeMinute}</Card.Text>
                                    <Card.Text><strong>{t("group_academic_hours")}:</strong> {attendance.academicHours}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <Button variant="danger" onClick={handleBack}>
                        {t("back")}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewAttendanceHistory;