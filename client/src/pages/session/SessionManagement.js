import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/sessions", { credentials: "include" })
            .then(response => response.json())
            .then(data => setSessions(data))
            .catch(error => console.error("Error fetching sessions:", error));
    }, [navigate]);

    const handleViewSession = (id) => {
        navigate(`/view-session/${id}`);
    };

    const handleEditSession = (id) => {
        navigate(`/edit-session/${id}`);
    };

    const handleAddSession = () => {
        navigate("/add-session");
    };

    const handleSessionHistory = () => {
        navigate("/session-history");
    };

    const handleFinishSession = (id) => {
        fetch(`/api/sessions/${id}/finish`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(() => {
            fetch("/api/sessions", { credentials: "include" })
                .then(response => response.json())
                .then(data => setSessions(data));
        })
        .catch(error => console.error("Error finishing session:", error));
    };

    const handleDeleteSession = (id) => {
        fetch(`/api/sessions/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            fetch("/api/sessions", { credentials: "include" })
                .then(response => response.json())
                .then(data => setSessions(data));
        });
    };

    return (
        <div className="session-container">
            <h1 className="session-title">Apmācību sesiju pārvaldība</h1>
            <div className="session-grid">
                {sessions.map(session => (
                    <div className="session-card" key={session._id}>
                        <div><strong>Datums:</strong> {new Date(session.date).toLocaleDateString()}</div>
                        <div><strong>Grupa:</strong> {session.group.title}</div>
                        <div>
                            <button className="session-button" onClick={() => handleViewSession(session._id)}>Apskatīt</button>
                            <button className="session-button" onClick={() => handleEditSession(session._id)}>Rediģēt</button>
                            <button className="session-button" onClick={() => handleFinishSession(session._id)}>Pabeigt</button>    
                            <button className="session-button" onClick={() => handleDeleteSession(session._id)}>Izdzēst</button>
                        </div>
                    </div>
                ))}
                <div className="addbuttoncard">
                    <button className="session-button" onClick={handleAddSession}>Pievienot sesiju</button>
                </div>
            </div>
            <button className="session-history-management-button" onClick={handleSessionHistory}>Sesijas vēsture</button>
        </div>
    );
};

export default SessionManagement;