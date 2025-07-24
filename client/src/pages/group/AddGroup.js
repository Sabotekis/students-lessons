import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AddGroup = () => {
    const [newGroup, setNewGroup] = useState({ registerNumber: "", title: "", startDate: "", endDate: "", professor: "", academicHours: 0, minHours: 0 });
    const [plannedMonths, setPlannedMonths] = useState([]);
    const [plannedData, setPlannedData] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (newGroup.startDate && newGroup.endDate) {
            const startDate = new Date(newGroup.startDate);
            const endDate = new Date(newGroup.endDate);
            const months = [];

            while (startDate <= endDate) {
                const year = startDate.getFullYear();
                const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
                months.push(`${year}-${month}`);
                startDate.setMonth(startDate.getMonth() + 1);
            }

            setPlannedMonths(months);
        } else {
            setPlannedMonths([]);
        }
    }, [newGroup.startDate, newGroup.endDate]);

    const handlePlannedChange = (month, field, value) => {
        setPlannedData(prev => {
            const updatedPlannedData = {
                ...prev,
                [month]: {
                    ...prev[month],
                    [field]: value,
                },
            };
    
            const totalPlannedHours = Object.values(updatedPlannedData).reduce((sum, monthData) => {
                return sum + (parseInt(monthData.hours, 10) || 0);
            }, 0);
    
            setNewGroup(prevGroup => ({
                ...prevGroup,
                academicHours: totalPlannedHours,
            }));
    
            return updatedPlannedData;
        });
    };

    const handleAddGroup = () => {
        if (!newGroup.registerNumber || !newGroup.title || !newGroup.startDate || !newGroup.endDate || !newGroup.professor || !newGroup.minHours) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(newGroup.startDate) > new Date(newGroup.endDate)) {
            alert("Sākuma datums nedrīkst būt pēc beigu datuma");
            return;
        }
        if (newGroup.academicHours <= 0) {
            alert("Akadēmisko stundu skaitam jābūt lielākam par 0");
            return;
        }
        if (newGroup.minHours > newGroup.academicHours) {
            alert("Minimālais stundu skaits nevar būt lielāks par akadēmiskajām stundām");
            return;
        }
        if (newGroup.minHours < 0) {
            alert("Minimālais stundu skaits nevar būt negatīvs");
            return;
        }
        if (Object.keys(plannedData).length === 0) {
            alert("Nepieciešams vismaz viens plānotais mēnesis");
            return;
        }
        if (Object.values(plannedData).some(data => !data.days || !data.hours)) {
            alert("Jāaizpilda visas plānotās dienas un stundas");
            return;
        }
        if (Object.values(plannedData).some(data => data.hours < 0 || data.days < 0)) {
            alert("Plānotās dienas un stundas nevar būt negatīvas");
            return;
        }

        const groupData = { ...newGroup, plannedData };

        fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(groupData)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/group-management");
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h3>{t("add_group_title")}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_register_number")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newGroup.registerNumber}
                                                onChange={(e) => setNewGroup({ ...newGroup, registerNumber: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_name")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newGroup.title}
                                                onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_start_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={newGroup.startDate}
                                                onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_end_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={newGroup.endDate}
                                                onChange={(e) => setNewGroup({ ...newGroup, endDate: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_professor")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newGroup.professor}
                                                onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_min_hours")}</strong></Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={newGroup.minHours}
                                                onChange={(e) => setNewGroup({ ...newGroup, minHours: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <div className="text-center">
                                            <strong>{t("group_academic_hours")}: </strong> {newGroup.academicHours}
                                        </div>
                                    </Col>
                                </Row>

                                {plannedMonths.length > 0 && (
                                    <>
                                        <h5 className="mb-3">{t("group_planned_months")}</h5>
                                        {plannedMonths.map(month => (
                                            <Card key={month} className="mb-3">
                                                <Card.Header>
                                                    <h6>{month}</h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col xs={12} md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>{t("group_planned_days")}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={plannedData[month]?.days || ""}
                                                                    onChange={(e) => handlePlannedChange(month, "days", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>{t("group_planned_hours")}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={plannedData[month]?.hours || ""}
                                                                    onChange={(e) => handlePlannedChange(month, "hours", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </>
                                )}

                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                    <Button variant="success" onClick={handleAddGroup}>
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

export default AddGroup;