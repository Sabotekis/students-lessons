import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddCertificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newCertificate, setNewCertificate] = useState({
        student: '',
        group: '',
        issueData: '',
    });
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch('/api/students') 
            .then((res) => res.json())
            .then((data) => setStudents(data));

        fetch('/api/groups')
            .then((res) => res.json())
            .then((data) => setGroups(data));
    }, []);

    const handleGroupChange = (groupId) => {
        setNewCertificate({
            ...newCertificate,
            group: groupId,
            student: '',
        });
        fetch(`/api/certificates/eligible-students/${groupId}`)
            .then((res) => res.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error('Error fetching eligible students:', error));
    };

    const handleAddCertificate = () => {
        if (!newCertificate.group || !newCertificate.student) {
            alert("Visi lauki ir obligāti");
            return;
        }

        fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCertificate),
        })
            .then((res) => res.json())
            .then((data) => setCertificates([...certificates, data]))
            .catch((err) => console.error('Error:', err));
            navigate('/certificate-management'); 
    };

    const handleBack = () => {
        navigate('/certificate-management');
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">
                        {t("add_certificate_title")}
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
                                        value={newCertificate.group} 
                                        onChange={(e) => handleGroupChange(e.target.value)}
                                        name="group"
                                        required
                                    >
                                        <option value="">{t("group_choose")}</option>
                                        {groups.map((group) => (
                                            <option key={group._id} value={group._id}>
                                                {group.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Select
                                        name="student"
                                        value={newCertificate.student}
                                        onChange={(e) => setNewCertificate({ ...newCertificate, student: e.target.value })}
                                        disabled={!newCertificate.group}                                        
                                        required
                                    >
                                        <option value="">{t("student_choose")}</option>
                                        {students.map((student) => (
                                            <option key={student.id || student._id} value={student.id || student._id}>
                                                {student.name} {student.surname}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button variant="success" onClick={handleAddCertificate} className="me-2">
                                        {t("add")}
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

export default AddCertificate;