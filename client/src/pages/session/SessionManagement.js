import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/sessions", { credentials: "include" })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                }
                return response.json();
            })
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
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to finish session");
            }
            return response.json();
        })
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
            <h1 className="session-title">Apmācību sesiju pārvaldība:</h1>
            <button className="session-history-back-button" onClick={handleSessionHistory}>Session History</button>
            <div className="session-grid">
                {sessions.map(session => (
                    <div className="session-card" key={session._id}>
                        <div><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</div>
                        <div><strong>Group:</strong> {session.group.title}</div>
                        <div>
                            <button className="session-button" onClick={() => handleViewSession(session._id)}>View</button>
                            <button className="session-button" onClick={() => handleEditSession(session._id)}>Edit</button>
                            <button className="session-button" onClick={() => handleFinishSession(session._id)}>Finish</button>    
                            <button className="session-button" onClick={() => handleDeleteSession(session._id)}>Delete</button>
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