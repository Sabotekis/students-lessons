import { useState, useEffect } from 'react';
import './roles.css';
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
        <div className="role-management-container">
            <h1 className="role-management-title">{t("role_management_title")}</h1>
            {selectedRole === null && hasPermission('roles.create') && (
                <input
                    className="role-management-input"
                    type="text"
                    placeholder={t("new_role_name")}
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                />
            )}
            <select
                className="role-management-select"
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
            </select>
            <div>
                {Object.keys(PermissionsData).map(section => {
                    const sectionPermissionKeys = PermissionsData[section].permissions.map(p => p.key);
                    const allSelected = sectionPermissionKeys.every(key => roleData.permissions.includes(key));
                    const someSelected = sectionPermissionKeys.some(key => roleData.permissions.includes(key));
                    return (
                        <div key={section} className='role-management-section'>
                            <label className='role-management-toggle'>
                                <input
                                    type="checkbox"
                                    checked={roleData.sections[section] || false}
                                    disabled={!hasPermission(`roles.create`)}
                                    onChange={() => handleToggleSection(section)}
                                />
                                <span className='toggle-slider'></span>
                                {PermissionsData[section].label}
                            </label>
                            <div>
                                {PermissionsData[section].permissions.map(permission => (
                                    <label key={permission.key} className='role-management-checkbox'>
                                        <input
                                            type="checkbox"
                                            checked={roleData.permissions.includes(permission.key)}
                                            disabled={!roleData.sections[section] || !hasPermission(`roles.create`)} 
                                            onChange={() => handlePermissionChange(permission.key)}
                                        />
                                        {permission.label}
                                    </label>
                                ))}
                            </div>
                            <label className='role-management-checkbox'>
                                <input
                                    type="checkbox"
                                    disabled={!roleData.sections[section] || !hasPermission('roles.create')}
                                    checked={allSelected}
                                    indeterminate={someSelected && !allSelected ? "indeterminate" : undefined}
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
                                Pievienot visas
                            </label>
                        </div>
                )})}
            </div>
            {hasPermission('roles.create') &&
                <button className='role-management-button' onClick={handleSaveRole}>
                    {selectedRole ? `${t("update")}` : `${t("add")}`}
                </button>
            }
            {hasPermission('roles.assign') && <button className='role-management-button' onClick={handleRoleAssign}>{t("role_add")}</button>}
            <button className='role-management-button' onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default RoleManagement;