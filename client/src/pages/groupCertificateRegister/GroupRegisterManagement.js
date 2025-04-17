import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groupCertificate.css'

const GroupRegisterManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGenerateRegister = () => {
        if (!selectedGroup) {
            alert("Izvēlieties grupu.");
            return;
        }

        navigate(`/group-register/${selectedGroup}`);
    };

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <div className="group-register-management-container">
            <h1 className="group-register-management-title">Grupas reģistra pārvaldība</h1>
            <div>
                <select
                    className="group-register-management-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">Izvēlieties grupu</option>
                    {groups.map(group => (
                        <option key={group._id} value={group._id}>
                            {group.title}
                        </option>
                    ))}
                </select>
            </div>
            <button className="group-register-management-button" onClick={handleGenerateRegister}>
                Izveidot grupas reģistru
            </button>
            <button className="group-register-management-button" onClick={handleBack}>
                Atgriezties
            </button>
        </div>
    );
};

export default GroupRegisterManagement;