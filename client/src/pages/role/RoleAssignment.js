import { useState, useEffect } from 'react';
import './roles.css';
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
        <div className="role-assign-container">
            <h1 className='role-assign-title'>{t("role_assign_title")}</h1>
            <div>
                {users.map(user => (
                    <div key={user._id}>
                        <p><strong>{t("role_username")}:</strong> {user.username}</p>
                        <p><strong>{t("email")}:</strong> {user.email}</p>
                        <select
                            className='role-assign-select'
                            onChange={(e) => handleAssignRole(user._id, e.target.value)}
                            defaultValue={user.role?._id || ''}
                        >
                            <option value="">{t("role_choose")}</option>
                            {roles.map(role => (
                                <option key={role._id} value={role._id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <button className="role-assign-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default RoleAssignment;