import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/sessions")
            .then(response => response.json())
            .then(data => setSessions(data));
    }, []);

    const handleViewSession = (id) => {
        navigate(`/view-session/${id}`);
    };

    const handleEditSession = (id) => {
        navigate(`/edit-session/${id}`);
    };

    const handleAddSession = () => {
        navigate("/add-session");
    };

    const handleDeleteSession = (id) => {
        fetch(`/api/sessions/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setSessions(sessions.filter(session => session._id !== id));
        });
    };

    return (
        <div className="session-container">
            <h1 className="session-title">Session Management</h1>
            <div className="session-grid">
                {sessions.map(session => (
                    <div className="session-card" key={session._id}>
                        <div><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</div>
                        <div>
                            <button className="button" onClick={() => handleViewSession(session._id)}>View</button>
                            <button className="button" onClick={() => handleEditSession(session._id)}>Edit</button>
                            <button className="button" onClick={() => handleDeleteSession(session._id)}>Delete</button>
                        </div>
                    </div>
                ))}
                <div className="addbuttoncard">
                    <button className="session-button" onClick={handleAddSession}>Add Session</button>
                </div>
            </div>
        </div>
    );
};

export default SessionManagement;