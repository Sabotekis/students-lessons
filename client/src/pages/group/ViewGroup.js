import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ViewGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/groups/${id}`)
            .then(response => response.json())
            .then(data => setGroup(data))
            .catch(error => console.error('Error fetching group:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleEditGroup = () => {
        navigate(`/edit-group/${id}`);
    };

    const handleDeleteGroup = () => {
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                navigate("/group-management");
            })
            .catch(error => console.error('Error deleting group:', error));
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    const handleAddStudentToGroup = (groupId) => {
        navigate("/student-management", { state: { groupId } });
    };

    const handleDeleteStudentFromGroup = (studentId) => {
        fetch(`/api/groups/${id}/remove-student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId })
        })
            .then(response => response.json())
            .then(() => {
                setGroup({
                    ...group,
                    students: group.students.filter(student => student._id !== studentId)
                });
            })
            .catch(error => console.error('Error removing student from group:', error));
    };

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <div className="text-center mb-4">
                        <h1>{t("view_group_title")}</h1>
                    </div>
                </Col>
            </Row>

            <Row className="d-flex justify-content-center mb-2">
                <Col xs={12} lg={6} className="text-center">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_register_number")}:</strong> {group.registerNumber}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_name")}:</strong> {group.title}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString()}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString()}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_professor")}:</strong> {group.professor}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_academic_hours")}:</strong> {group.academicHours}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_min_hours")}:</strong> {group.minHours}
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <strong>{t("group_planned_data")}:</strong>
                                    <div className="mt-2">
                                        {Object.entries(group.plannedData).map(([month, data]) => (
                                            <div key={month} className="mb-1">
                                                <strong>{month}:</strong> {data.days} {t("days")}, {data.hours} {t("hours")}
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    {group.students.length === 0 ? (
                        <div></div>
                    ) : (
                        <div className="text-center mb-4">
                            <h3><strong>{t("students")}:</strong></h3>
                        </div>
                    )}
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                {group.students.map(student => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={student._id}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("student_name")}:</strong> {student.name}</Card.Text>
                                <Card.Text><strong>{t("student_surname")}:</strong> {student.surname}</Card.Text>
                                <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode}</Card.Text>
                                <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</Card.Text>
                                <Card.Text><strong>{t("student_email")}:</strong> {student.email}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                {hasPermission('groups.deleteStudents') && (
                                    <Button variant="danger" onClick={() => handleDeleteStudentFromGroup(student._id)} className="w-100">
                                        {t("remove")}
                                    </Button>
                                )}
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        {hasPermission('groups.update') && (
                            <Button variant="success" onClick={handleEditGroup} className="me-2">
                                {t("edit")}
                            </Button>
                        )}
                        {hasPermission('groups.addStudents') && (
                            <Button variant="success" onClick={() => handleAddStudentToGroup(group._id)} className="me-2">
                                {t("student_add")}
                            </Button>
                        )}
                        <Button variant="danger" onClick={handleBack} className="me-2">
                            {t("back")}
                        </Button>
                        {hasPermission('groups.delete') && (
                            <Button variant="danger" onClick={handleDeleteGroup} className="me-2">
                                {t("delete")}
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewGroup;