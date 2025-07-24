import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { getPermissionsData } from '../../components/PermissionsData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleData, setRoleData] = useState({ sections: {}, permissions: [] });
    const [newRoleName, setNewRoleName] = useState('');
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();
    const PermissionsData = getPermissionsData(t);

    useEffect(() => {
        fetch('/api/roles')
            .then(res => res.json())
            .then(data => setRoles(data));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, []);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleToggleSection = (section) => {
        setRoleData(prev => {
            const isSectionEnabled = !prev.sections[section];
            const updatedPermissions = isSectionEnabled
                ? prev.permissions
                : prev.permissions.filter(permissionKey =>
                    !PermissionsData[section].some(permission => permission.key === permissionKey)
                );

            return {
                ...prev,
                sections: { ...prev.sections, [section]: isSectionEnabled },
                permissions: updatedPermissions,
            };
        });
    };

    const handlePermissionChange = (permissionKey) => {
        setRoleData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permissionKey)
                ? prev.permissions.filter(key => key !== permissionKey)
                : [...prev.permissions, permissionKey],
        }));
    };
    
    const handleSaveRole = () => {
        if (!selectedRole && !newRoleName.trim()) {
            alert('Role name cannot be empty!');
            return;
        }
        if (selectedRole) {
            fetch(`/api/roles/${selectedRole._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleData),
            }).then(() => {
                alert('Loma veiksmīgi atjaunināta!');
                window.location.reload();
            });
        } else {
            const allSections = Object.keys(PermissionsData).reduce((acc, section) => {
                acc[section] = !!roleData.sections[section];
                return acc;
            }, {});
    
            fetch('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newRoleName, 
                    sections: allSections,
                    permissions: roleData.permissions 
                }),
            }).then(() => {
                alert('Veiksmīgi izveidota jauna loma!');
                setNewRoleName('');
                window.location.reload();
            });
        }
    };

    const handleRoleAssign = () => {
        navigate('/role-assignment');
    }

    const handleBack = () => {
        navigate('/');
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("role_management_title")}</h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card>
                        <Card.Body>
                            {selectedRole === null && hasPermission('roles.create') && (
                                <Form.Group className="mb-3">
                                    <Form.Label>{t("new_role_name")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t("new_role_name")}
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                    />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-4">
                                <Form.Label>{t("role_choose")}</Form.Label>
                                <Form.Select
                                    onChange={(e) => {
                                        const role = roles.find(r => r._id === e.target.value);
                                        setSelectedRole(role || null);
                                        setRoleData(role ? { sections: role.sections, permissions: role.permissions } : { sections: {}, permissions: [] });
                                    }}
                                >
                                    <option value="">{t("role_choose")}</option>
                                    {roles.map(role => (
                                        <option key={role._id} value={role._id}>{role.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <div>
                                {Object.keys(PermissionsData).map(section => {
                                    const sectionPermissionKeys = PermissionsData[section].permissions.map(p => p.key);
                                    const allSelected = sectionPermissionKeys.every(key => roleData.permissions.includes(key));
                                    const someSelected = sectionPermissionKeys.some(key => roleData.permissions.includes(key));
                                    return (
                                        <Card key={section} className="mb-3">
                                            <Card.Header>
                                                <Form.Check
                                                    type="switch"
                                                    id={`section-${section}`}
                                                    label={PermissionsData[section].label}
                                                    checked={roleData.sections[section] || false}
                                                    disabled={!hasPermission(`roles.create`)}
                                                    onChange={() => handleToggleSection(section)}
                                                />
                                            </Card.Header>
                                            <Card.Body>
                                                <Row className="g-2">
                                                    {PermissionsData[section].permissions.map(permission => (
                                                        <Col xs={12} sm={6} md={4} key={permission.key}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`permission-${permission.key}`}
                                                                label={permission.label}
                                                                checked={roleData.permissions.includes(permission.key)}
                                                                disabled={!roleData.sections[section] || !hasPermission(`roles.create`)}
                                                                onChange={() => handlePermissionChange(permission.key)}
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                                <hr />
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`select-all-${section}`}
                                                    label="Pievienot visas"
                                                    disabled={!roleData.sections[section] || !hasPermission('roles.create')}
                                                    checked={allSelected}
                                                    ref={checkbox => {
                                                        if (checkbox) checkbox.indeterminate = someSelected && !allSelected;
                                                    }}
                                                    onChange={e => {
                                                        setRoleData(prev => {
                                                            let newPermissions;
                                                            if (e.target.checked) {
                                                                newPermissions = [
                                                                    ...prev.permissions,
                                                                    ...sectionPermissionKeys.filter(key => !prev.permissions.includes(key))
                                                                ];
                                                            } else {
                                                                newPermissions = prev.permissions.filter(key => !sectionPermissionKeys.includes(key));
                                                            }
                                                            return { ...prev, permissions: newPermissions };
                                                        });
                                                    }}
                                                />
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>

                            {hasPermission('roles.create') && (
                                <div className="d-grid">
                                    <Button variant="success" onClick={handleSaveRole}>
                                        {selectedRole ? t("update") : t("add")}
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        {hasPermission('roles.assign') && (
                            <Button variant="success" onClick={handleRoleAssign} className="me-2">
                                {t("role_add")}
                            </Button>
                        )}
                        <Button variant="danger" onClick={handleBack} className="me-2">
                            {t("back")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RoleManagement;