import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("title");
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups", {credentials: "include"})
            .then(response => response.json())
            .then(data => setGroups(data));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleAddGroup = () => {
        navigate("/add-group");
    };

    const handleEditGroup = (id) => {
        navigate(`/edit-group/${id}`);
    };

    const handleViewGroup = (id) => {
        navigate(`/view-group/${id}`);
    };

    const handleDeleteGroup = (id) => {
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setGroups(groups.filter(group => group._id !== id));
        });
    };

    const handleAddStudentToGroup = (groupId) => {
        navigate("/student-management", { state: { groupId } });
    };

    const filteredGroups = groups
        .filter(group => {
            const value = group[filterBy]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const valueA = (a[filterBy]?.toLowerCase() || "");
            const valueB = (b[filterBy]?.toLowerCase() || "");
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
    
    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("group_title")}</h1>
                </Col>
            </Row>
            
            <Row className="mb-1">
                <Col xs={12} md={6} lg={4} className="mb-1">
                    <Form.Control
                        type="text"
                        placeholder={t("student_search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={4} lg={3} className="mb-1">
                    <Form.Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                        <option value="title">{t("group_name")}</option>
                        <option value="registerNumber">{t("group_register_number")}</option>
                        <option value="professor">{t("group_professor")}</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="g-3">
                {filteredGroups.map(group => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={group._id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("group_register_number")}:</strong> {group.registerNumber}</Card.Text>
                                <Card.Text><strong>{t("group_name")}:</strong> {group.title}</Card.Text>
                                <Card.Text><strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString("lv-LV")}</Card.Text>
                                <Card.Text><strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString("lv-LV")}</Card.Text>
                                <Card.Text><strong>{t("group_professor")}:</strong> {group.professor}</Card.Text>
                                <Card.Text><strong>{t("group_academic_hours")}:</strong> {group.academicHours}</Card.Text>
                                <Card.Text><strong>{t("group_min_hours")}:</strong> {group.minHours}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-grid gap-2">
                                    <Button variant="success" onClick={() => handleViewGroup(group._id)}>
                                        {t("view")}
                                    </Button>
                                    {hasPermission('groups.update') && (
                                        <Button variant="success" onClick={() => handleEditGroup(group._id)}>
                                            {t("edit")}
                                        </Button>
                                    )}
                                    {hasPermission('groups.addStudents') && (
                                        <Button variant="success" onClick={() => handleAddStudentToGroup(group._id)}>
                                            {t("student_add")}
                                        </Button>
                                    )}
                                    {hasPermission('groups.delete') && (
                                        <Button variant="danger" onClick={() => handleDeleteGroup(group._id)}>
                                            {t("delete")}
                                        </Button>
                                    )}
                                    
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
                {hasPermission('groups.create') && (
                    <Col xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100">
                            <Card.Body className="d-flex align-items-center justify-content-center text-center">
                                <Button variant="success" size="lg" onClick={handleAddGroup}>
                                    {t("group_add")}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default GroupManagement;