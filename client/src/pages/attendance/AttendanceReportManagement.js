import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const AttendanceReportManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGroupChange = (groupId) => {
        setSelectedGroup(groupId);
        setSelectedMonth("");

        const group = groups.find(g => g._id === groupId);
        if (group) {
            const startDate = new Date(group.startDate);
            const endDate = new Date(group.endDate);
            const months = [];

            while (startDate <= endDate) {
                const year = startDate.getFullYear();
                const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
                months.push(`${year}-${month}`);
                startDate.setMonth(startDate.getMonth() + 1);
            }

            setAvailableMonths(months);
        } else {
            setAvailableMonths([]);
        }
    };

    const handleShowReport = () => {
        if (!selectedGroup || !selectedMonth) {
            alert("Izvēlieties gan grupu, gan mēnesi");
            return;
        }
    
        navigate("/attendance-report", {
            state: {
                groupId: selectedGroup,
                month: selectedMonth,
            },
        });
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("attendance_report_management_title")}</h1>
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

                                <Form.Group className="mb-3">
                                    <Form.Select 
                                        value={selectedMonth} 
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        disabled={!availableMonths.length}
                                        required
                                    >
                                        <option value="">{t("month_choose")}</option>
                                        {availableMonths.map(month => (
                                            <option key={month} value={month}>
                                                {new Date(`${month}-01`).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button variant="success" onClick={handleShowReport}>
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

export default AttendanceReportManagement;