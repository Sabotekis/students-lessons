import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state?.groupId;
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/students", {credentials: "include"})
            .then(response => response.json())
            .then(data => setStudents(data));

        if (groupId) {
            fetch(`/api/groups/${groupId}`, {credentials: "include"})
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));
        }
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [groupId, navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);
    
    const handleAddStudent = () => {
        navigate("/add-student");
    };

    const handleEditStudent = (id) => {
        navigate(`/edit-student/${id}`);
    };

    const handleDeleteStudent = (id) => {
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setStudents(students.filter(student => student._id !== id));
        });
    };

    const handleViewStudent = (id) => {
        navigate(`/view-student/${id}`);
    };

    const handleAddStudentToGroup = (studentId) => {
        fetch(`/api/groups/${groupId}/add-student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            fetch("/api/students")
                .then(response => response.json())
                .then(data => setStudents(data));

            fetch(`/api/groups/${groupId}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));

            navigate(`/view-group/${groupId}`);
        })
        .catch(error => {
            console.error('Error adding student to group:', error);
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    const filteredStudents = students
        .filter(student => {
            const value = student[filterBy]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        })
        .filter(student => !groupStudents.some(groupStudent => groupStudent._id === student._id))
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
                    <h1 className="text-center mb-4">{t("student_title")}</h1>
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
                        <option value="name">{t("student_name")}</option>
                        <option value="surname">{t("student_surname")}</option>
                        <option value="personalCode">{t("student_personal_code")}</option>
                        <option value="phoneNumber">{t("student_phone_number")}</option>
                        <option value="email">{t("student_email")}</option>
                    </Form.Select>
                </Col>
                {groupId && (
                    <Col xs={12} md={2} lg={2} className="mb-1">
                        <Button variant="danger" onClick={handleBack} className="w-100">
                            {t("back")}
                        </Button>
                    </Col>
                )}
            </Row>

            <Row className="g-3">
                {groupId && filteredStudents.length === 0 ? (
                    <Col xs={12}>
                        <div className="text-center p-4">{t("student_none")}</div>
                    </Col>
                ) : (
                    filteredStudents.map(student => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={student._id}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <Card.Text><strong>{t("student_name")}:</strong> {student.name}</Card.Text>
                                    <Card.Text><strong>{t("student_surname")}:</strong> {student.surname}</Card.Text>
                                    <Card.Text><strong>{t("student_personal_code")}:</strong> {student.personalCode}</Card.Text>
                                    <Card.Text><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</Card.Text>
                                    <Card.Text><strong>{t("student_email")}:</strong> {student.email}</Card.Text>
                                    <Card.Text><strong>{t("student_academic_hours")}:</strong> {student.totalAcademicHours}</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-grid gap-2">
                                        {groupId ? (
                                            <Button variant="success" onClick={() => handleAddStudentToGroup(student._id)}>
                                                {t("student_add")}
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="success" onClick={() => handleViewStudent(student._id)}>
                                                    {t("view")}
                                                </Button>
                                                {hasPermission('students.update') && (
                                                    <Button variant="success" onClick={() => handleEditStudent(student._id)}>
                                                        {t("edit")}
                                                    </Button>
                                                )}
                                                {hasPermission('students.delete') && (
                                                    <Button variant="danger" onClick={() => handleDeleteStudent(student._id)}>
                                                        {t("delete")}
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                )}
                {!groupId && hasPermission('students.create') && (
                    <Col xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100">
                            <Card.Body className="d-flex align-items-center justify-content-center text-center">
                                <Button variant="success" size="lg" onClick={handleAddStudent}>
                                    {t("student_add")}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default StudentManagement;