import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const AttendanceGroupReportManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGenerateReport = () => {
        if (!selectedGroup) {
            alert("Izvēlieties grupu");
            return;
        }

        navigate(`/attendance-group-report/${selectedGroup}`);
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("attendance_group_report_management_title")}</h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Select 
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
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

                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button variant="success" onClick={handleGenerateReport}>
                                        {t("generate")}
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

export default AttendanceGroupReportManagement;