import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EditSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState({
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
        fetch(`/api/sessions/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Session data:', data); // Debug log
                setSession({
                    groupId: data.group?._id || "",
                    startDateTime: data.startDateTime ? data.startDateTime.slice(0, 16) : "",
                    endDateTime: data.endDateTime ? data.endDateTime.slice(0, 16) : ""
                });
                
                // Set selected students from session data
                if (data.students && Array.isArray(data.students)) {
                    setSelectedStudents(data.students.map(student => 
                        typeof student === 'string' ? student : student._id
                    ));
                }
            })
            .catch(error => console.error('Error fetching session:', error));

        fetch("/api/groups")
            .then(response => response.json())
            .then(data => {
                console.log('Groups data:', data); // Debug log
                setGroups(data);
            })
            .catch(error => console.error('Error fetching groups:', error));
    }, [id]);

    // Update selectedGroup when groups are loaded and session groupId is available
    useEffect(() => {
        if (groups.length > 0 && session.groupId) {
            const group = groups.find(g => g._id === session.groupId);
            console.log('Found group:', group); // Debug log
            setSelectedGroup(group);
        }
    }, [groups, session.groupId]);

    const handleGroupChange = (groupId) => {
        setSession({ ...session, groupId });
        const group = groups.find(g => g._id === groupId);
        setSelectedGroup(group);
        // Reset selected students when group changes
        setSelectedStudents(group && group.students ? group.students.map(student => student._id) : []);
    };

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleUpdateSession = () => {
        if (!session.groupId || !session.startDateTime || !session.endDateTime) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(session.startDateTime) >= new Date(session.endDateTime)) {
            alert("Sākuma laiks nedrīkst būt pēc vai vienāds ar beigu laiku");
            return;
        }
        if (selectedStudents.length === 0) {
            alert("Jāizvēlas vismaz viens students");
            return;
        }

        const updatedSession = {
            ...session,
            group: session.groupId,
            students: selectedStudents
        };

        fetch(`/api/sessions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSession)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/view-session/" + id);
        })
        .catch(error => console.error('Error updating session:', error));
    };

    const handleBack = () => {
        navigate("/view-session/" + id);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h3>{t("edit_session_title")}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xs={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("group_name")}</Form.Label>
                                            <Form.Select
                                                value={session.groupId}
                                                onChange={(e) => handleGroupChange(e.target.value)}
                                                required
                                            >
                                                <option value="">{t("select_group")}</option>
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
                                            <Form.Label>{t("session_start_date")}</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={session.startDateTime}
                                                onChange={(e) => setSession({ ...session, startDateTime: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{t("session_end_date")}</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={session.endDateTime}
                                                onChange={(e) => setSession({ ...session, endDateTime: e.target.value })}
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
                                                            <Card.Text><strong>{t("student_name")}:</strong> {student.name || 'N/A'}</Card.Text>
                                                            <Card.Text><strong>{t("student_surname")}:</strong> {student.surname || 'N/A'}</Card.Text>
                                                            <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode || 'N/A'}</Card.Text>
                                                            <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber || 'N/A'}</Card.Text>
                                                            <Card.Text><strong>{t("student_email")}:</strong> {student.email || 'N/A'}</Card.Text>
                                                            {student.deleted && (
                                                                <Card.Text className="text-muted">({t("student_deleted")})</Card.Text>
                                                            )}
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

                                {selectedGroup && (!selectedGroup.students || selectedGroup.students.length === 0) && (
                                    <div className="text-center mt-3">
                                        <p>{t("no_students_in_group")}</p>
                                    </div>
                                )}

                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                    <Button variant="success" onClick={handleUpdateSession}>
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

export default EditSession;