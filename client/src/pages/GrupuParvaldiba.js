import React, { useState, useEffect } from "react";
import './MainContainer.css';

const GrupuParvaldiba = () => {
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [newGroup, setNewGroup] = useState({ title: "", start_date: "", end_date: "", professor: "" });

    useEffect(() => {
        // Fetch groups and students from the server
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data));

        fetch("/api/students")
            .then(response => response.json())
            .then(data => setStudents(data));
    }, []);

    const handleAddGroup = () => {
        // Add group to the server
        fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGroup)
        })
        .then(response => response.json())
        .then(newGroup => setGroups([...groups, newGroup]));
    };

    const handleEditGroup = (id, updatedGroup) => {
        // Edit group on the server
        fetch(`/api/groups/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedGroup)
        })
        .then(response => response.json())
        .then(() => {
            setGroups(groups.map(group => group.id === id ? updatedGroup : group));
        });
    };

    const handleDeleteGroup = (id) => {
        // Delete group from the server
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setGroups(groups.filter(group => group.id !== id));
        });
    };

    return (
        <div className="main-container">
            <h1>Grupu Pārvaldība</h1>
            <input
                type="text"
                placeholder="Group title"
                value={newGroup.title}
                onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
            />
            <input
                type="date"
                placeholder="Start date"
                value={newGroup.start_date}
                onChange={(e) => setNewGroup({ ...newGroup, start_date: e.target.value })}
            />
            <input
                type="date"
                placeholder="End date"
                value={newGroup.end_date}
                onChange={(e) => setNewGroup({ ...newGroup, end_date: e.target.value })}
            />
            <input
                type="text"
                placeholder="Professor"
                value={newGroup.professor}
                onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
            />
            <button onClick={handleAddGroup}>Add Group</button>
            <ul>
                {groups.map(group => (
                    <li key={group.id}>
                        {group.title}
                        <button onClick={() => handleEditGroup(group.id, { ...group, title: "Updated Title" })}>Edit</button>
                        <button onClick={() => handleDeleteGroup(group.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GrupuParvaldiba;

