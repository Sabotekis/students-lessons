import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groups.css';
import { useTranslation } from 'react-i18next';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
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
    
    return (
        <div className="group-container">
            <h1 className="group-title">{t("group_title")}</h1>
            <div className="group-grid">
                {groups.map(group => (
                    <div className="group-card" key={group._id}>
                        <div><strong>{t("group_register_number")}:</strong> {group.registerNumber}</div>
                        <div><strong>{t("group_name")}:</strong> {group.title}</div>
                        <div><strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString("lv-LV")}</div>
                        <div><strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString("lv-LV")}</div>
                        <div><strong>{t("group_professor")}:</strong> {group.professor}</div>
                        <div><strong>{t("group_academic_hours")}:</strong> {group.academicHours}</div>
                        <div><strong>{t("group_min_hours")}:</strong> {group.minHours}</div>
                        <div>
                            <button className="group-button" onClick={() => handleViewGroup(group._id)}>{t("view")}</button>
                            {hasPermission('groups.update') && <button className="group-button" onClick={() => handleEditGroup(group._id)}>{t("edit")}</button>}
                            {hasPermission('groups.delete') && <button className="group-button" onClick={() => handleDeleteGroup(group._id)}>{t("delete")}</button>}
                            {hasPermission('groups.addStudents') && <button className="group-button" onClick={() => handleAddStudentToGroup(group._id)}>{t("student_add")}</button>}
                        </div>
                    </div>
                ))}
                {hasPermission('groups.update') && (
                    <div className="add-button-card" onClick={handleAddGroup}>
                        <button className="group-button">{t("group_add")}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagement;