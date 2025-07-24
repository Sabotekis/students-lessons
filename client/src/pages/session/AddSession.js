import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AddSession = () => {
    const [newSession, setNewSession] = useState({
        groupId: "",
        startDateTime: "",
        endDateTime: ""
    });
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error('Error fetching groups:', error));
    }, []);

    const handleGroupChange = (groupId) => {
        setNewSession({ ...newSession, groupId });
        const group = groups.find(g => g._id === groupId);
        setSelectedGroup(group);
        setSelectedStudents(group ? group.students.map(student => student._id) : []);
    };

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddSession = () => {
        if (!newSession.groupId || !newSession.startDateTime || !newSession.endDateTime) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(newSession.startDateTime) >= new Date(newSession.endDateTime)) {
            alert("Sākuma laiks nedrīkst būt pēc vai vienāds ar beigu laiku");
            return;
        }
        if (selectedStudents.length === 0) {
            alert("Jāizvēlas vismaz viens students");
            return;
        }

        const sessionData = {
            ...newSession,
            group: newSession.groupId,
            students: selectedStudents
        };

        fetch("/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sessionData)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/session-management");
        })
        .catch(error => console.error('Error adding session:', error));
    };

    const handleBack = () => {
        navigate("/session-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h3>{t("add_session_title")}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xs={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_name")}</strong></Form.Label>
                                            <Form.Select
                                                value={newSession.groupId}
                                                onChange={(e) => handleGroupChange(e.target.value)}
                                                required
                                            >
                                                <option value="">{t("group_choose")}</option>
                                                {groups.map(group => (
                                                    <option key={group._id} value={group._id}>
                                                        {group.title}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("session_start_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={newSession.startDateTime}
                                                onChange={(e) => setNewSession({ ...newSession, startDateTime: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("session_end_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={newSession.endDateTime}
                                                onChange={(e) => setNewSession({ ...newSession, endDateTime: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {selectedGroup && selectedGroup.students && selectedGroup.students.length > 0 && (
                                    <>
                                        <h5 className="mb-3">{t("students")}</h5>
                                        <Row className="g-3 mb-3">
                                            {selectedGroup.students.map(student => (
                                                <Col xs={12} sm={6} lg={4} key={student._id}>
                                                    <Card className={`h-100 ${selectedStudents.includes(student._id) ? 'border-success' : 'border-secondary'}`}>
                                                        <Card.Body>
                                                            <Card.Text><strong>{t("student_name")}:</strong> {student.name}</Card.Text>
                                                            <Card.Text><strong>{t("student_surname")}:</strong> {student.surname}</Card.Text>
                                                            <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode}</Card.Text>
                                                            <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</Card.Text>
                                                            <Card.Text><strong>{t("student_email")}:</strong> {student.email}</Card.Text>
                                                        </Card.Body>
                                                        <Card.Footer>
                                                            <div className="d-grid">
                                                                <Button 
                                                                    variant={selectedStudents.includes(student._id) ? "danger" : "success"}
                                                                    onClick={() => handleStudentToggle(student._id)}
                                                                >
                                                                    {selectedStudents.includes(student._id) ? t("remove") : t("add")}
                                                                </Button>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </>
                                )}

                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                    <Button variant="success" onClick={handleAddSession}>
                                        {t("add")}
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

export default AddSession;