import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const AddAttendance = () => {
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [attendance, setAttendance] = useState({ groupId: "", sessionId: "", timeMinute: "", academicHours: 0 });
    const navigate = useNavigate();
    const location = useLocation();
    const { studentId } = location.state || {};
    const { t } = useTranslation();

    useEffect(() => {
        if (!studentId) return;

        fetch(`/api/students/${studentId}`)
            .then(response => response.json())
            .then(data => setFilteredGroups(data.groups))
            .catch(error => console.error("Error fetching student groups:", error));

        fetch("/api/sessions/finished")
            .then(response => response.json())
            .then(data => setSessions(data))
            .catch(error => console.error("Error fetching sessions:", error));
    }, [studentId]);

    const handleGroupChange = (groupId) => {
        setAttendance({ ...attendance, groupId, sessionId: "" });

        const groupSessions = sessions.filter(session =>
            session.group._id === groupId &&
            session.students.some(student => student._id === studentId) &&
            !session.attendances.some(attendance => attendance.student._id.toString() === studentId)
        );
        setFilteredSessions(groupSessions);
    };

    const handleMinutesChange = (minutes) => {
        const academicHours = Math.floor(minutes / 40); 
        setAttendance({ ...attendance, timeMinute: minutes, academicHours });
    };

    const handleAddAttendance = () => {
        if (!attendance.groupId || !attendance.sessionId || !attendance.timeMinute) {
            alert("All fields are required");
            return;
        }
    
        fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                student: studentId,
                session: attendance.sessionId,
                timeMinute: parseInt(attendance.timeMinute, 10),
                academicHours: parseInt(attendance.academicHours, 10),
            }),
        })
            .then(response => response.json())
            .then(() => {
                navigate("/attendance-management");
            })
            .catch(error => alert(error.message));
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };


    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">
                        {t("add_attendance_title")}
                    </h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Select 
                                        value={attendance.groupId} 
                                        onChange={(e) => handleGroupChange(e.target.value)}
                                        required
                                    >
                                        <option value="">{t("group_choose")}</option>
                                        {filteredGroups.map(group => (
                                            <option key={group._id} value={group._id}>
                                                {group.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Select 
                                        value={attendance.sessionId} 
                                        disabled={!attendance.groupId}
                                        onChange={(e) => setAttendance({ ...attendance, sessionId: e.target.value })}
                                        required
                                    >
                                        <option value="">{t("session_choose")}</option>
                                        {filteredSessions.map(session => (
                                            <option key={session._id} value={session._id}>
                                                {new Date(session.startDateTime).toLocaleDateString()} - {session.group.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <input
                                        className="add-attendance-input"
                                        type="number"
                                        placeholder={t("time_minute")}
                                        value={attendance.timeMinute}
                                        onChange={(e) => handleMinutesChange(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="mb-3">
                                    <strong>{t("student_academic_hours")}: {attendance.academicHours}</strong>
                                </div>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button variant="success" onClick={handleAddAttendance} className="me-2">
                                        {t("attendance_add")}
                                    </Button>
                                    <Button variant="danger" onClick={handleBack} className="me-2">
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

export default AddAttendance;