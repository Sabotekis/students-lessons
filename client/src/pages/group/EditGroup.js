import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EditGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({ registerNumber: "", title: "", startDate: "", endDate: "", professor: "", academicHours: 0, minHours: 0});
    const [plannedMonths, setPlannedMonths] = useState([]);
    const [plannedData, setPlannedData] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();        

    useEffect(() => {
        fetch(`/api/groups/${id}`)
            .then(response => response.json())
            .then(data => {
                setGroup({
                    ...data,
                    startDate: data.startDate.slice(0, 10),
                    endDate: data.endDate.slice(0, 10),
                });
    
                setPlannedData(data.plannedData || {});
            })
            .catch(error => console.error('Error fetching group:', error));
    
        if (group.startDate && group.endDate) {
            const startDate = new Date(group.startDate);
            const endDate = new Date(group.endDate);
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
    }, [id, group.startDate, group.endDate]);
    
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
    
            setGroup(prevGroup => ({
                ...prevGroup,
                academicHours: totalPlannedHours,
            }));
    
            return updatedPlannedData;
        });
    };

    const handleUpdateGroup = () => {
        if (!group.registerNumber || !group.title || !group.startDate || !group.endDate || !group.professor || !group.minHours) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(group.startDate) > new Date(group.endDate)) {
            alert("Sākuma datums nedrīkst būt pēc beigu datuma");
            return;
        }
        if (group.academicHours <= 0) {
            alert("Akadēmisko stundu skaitam jābūt lielākam par 0");
            return;
        }
        if (group.minHours > group.academicHours) {
            alert("Minimālais stundu skaits nevar būt lielāks par akadēmiskajām stundām");
            return;
        }
        if (group.minHours < 0) {
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
        const updatedGroup = { ...group, plannedData };
        fetch(`/api/groups/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedGroup)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/view-group/" + id);
        })
        .catch(error => console.error('Error updating group:', error));
    };

    const handleBack = () => {
        navigate("/view-group/" + id);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h3>{t("edit_group_title")}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_register_number")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={group.registerNumber}
                                                onChange={(e) => setGroup({ ...group, registerNumber: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_name")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={group.title}
                                                onChange={(e) => setGroup({ ...group, title: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_start_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={group.startDate}
                                                onChange={(e) => setGroup({ ...group, startDate: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_end_date")}</strong></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={group.endDate}
                                                onChange={(e) => setGroup({ ...group, endDate: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_professor")}</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={group.professor}
                                                onChange={(e) => setGroup({ ...group, professor: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label><strong>{t("group_min_hours")}</strong></Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={group.minHours}
                                                onChange={(e) => setGroup({ ...group, minHours: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <div className="text-center">
                                            <strong>{t("group_academic_hours")}: </strong> {group.academicHours}
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
                                                                <Form.Label><strong>{t("group_planned_days")}</strong></Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={plannedData[month]?.days || ""}
                                                                    onChange={(e) => handlePlannedChange(month, "days", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label><strong>{t("group_planned_hours")}</strong></Form.Label>
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
                                    <Button variant="success" onClick={handleUpdateGroup}>
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

export default EditGroup;