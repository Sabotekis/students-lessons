import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groups.css';

const GroupManagement = ({ isLoggedIn }) => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data));
    }, []);

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
            <h1 className="group-title">Grupu Parvaldība</h1>
            <div className="group-grid">
                {groups.map(group => (
                    <div className="group-card" key={group._id}>
                        <div><strong>Title:</strong> {group.title}</div>
                        <div><strong>Start Date:</strong> {new Date(group.start_date).toLocaleDateString()}</div>
                        <div><strong>End Date:</strong> {new Date(group.end_date).toLocaleDateString()}</div>
                        <div><strong>Professor:</strong> {group.professor}</div>
                        <div>
                            <button className="group-button" onClick={() => handleViewGroup(group._id)}>View</button>
                            {isLoggedIn && <button className="group-button" onClick={() => handleEditGroup(group._id)}>Edit</button>}
                            {isLoggedIn && <button className="group-button" onClick={() => handleDeleteGroup(group._id)}>Delete</button>}
                            {isLoggedIn && <button className="group-button" onClick={() => handleAddStudentToGroup(group._id)}>Add Student</button>}
                        </div>
                    </div>
                ))}
                {isLoggedIn && (
                    <div className="add-button-card" onClick={handleAddGroup}>
                        <button className="group-button">Add Group</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagement;