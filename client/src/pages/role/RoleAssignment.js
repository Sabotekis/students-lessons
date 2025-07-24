import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RoleAssignment = () => {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch('/api/roles')
            .then(res => res.json())
            .then(data => setRoles(data));

        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    const handleAssignRole = (userId, roleId) => {
        fetch(`/api/users/${userId}/assign-role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleId }),
        }).then(() => {
            alert('Sekmīgi piešķirta loma!');
        });
    };

    const handleBack = () => {
        navigate('/role-management');
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("role_assign_title")}</h1>
                </Col>
            </Row>

            <Row className="g-3">
                {users.map(user => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={user._id}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title className="text-center"><strong>{t("role_username")}:</strong> {user.username}</Card.Title>
                                <Card.Title className='text-center'><strong>{t("email")}:</strong> {user.email}</Card.Title>
                                <Form.Group className="mb-3">
                                    <Form.Select
                                        defaultValue={user.role?._id || ''}
                                        onChange={(e) => handleAssignRole(user._id, e.target.value)}
                                    >
                                        <option value="">{t("role_choose")}</option>
                                        {roles.map(role => (
                                            <option key={role._id} value={role._id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <Button variant="danger" onClick={handleBack}>
                        {t("back")}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default RoleAssignment;