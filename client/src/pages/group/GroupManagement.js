import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groups.css';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();

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
            <h1 className="group-title">Grupu parvaldība</h1>
            <div className="group-grid">
                {groups.map(group => (
                    <div className="group-card" key={group._id}>
                        <div><strong>Grupas registra numurs:</strong> {group.registerNumber}</div>
                        <div><strong>Nosaukums:</strong> {group.title}</div>
                        <div><strong>Sākuma datums:</strong> {new Date(group.startDate).toLocaleDateString("lv-LV")}</div>
                        <div><strong>Beigu datums:</strong> {new Date(group.endDate).toLocaleDateString("lv-LV")}</div>
                        <div><strong>Profesors:</strong> {group.professor}</div>
                        <div><strong>Akadēmiskās stundas:</strong> {group.academicHours}</div>
                        <div><strong>Minimālais stundu skaits:</strong> {group.minHours}</div>
                        <div>
                            <button className="group-button" onClick={() => handleViewGroup(group._id)}>Apskatīt</button>
                            {hasPermission('groups.update') && <button className="group-button" onClick={() => handleEditGroup(group._id)}>Rediģēt</button>}
                            {hasPermission('groups.delete') && <button className="group-button" onClick={() => handleDeleteGroup(group._id)}>Izdzēst</button>}
                            {hasPermission('groups.addStudents') && <button className="group-button" onClick={() => handleAddStudentToGroup(group._id)}>Pievienot studentu</button>}
                        </div>
                    </div>
                ))}
                {hasPermission('groups.update') && (
                    <div className="add-button-card" onClick={handleAddGroup}>
                        <button className="group-button">Pievienot grupu</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagement;