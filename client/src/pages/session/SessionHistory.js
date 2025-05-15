import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const SessionHistory = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/sessions/finished", { credentials: "include" })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                }
                return response.json();
            })
            .then(data => setSessions(data))
            .catch(error => {
                console.error("Error fetching session history:", error);
                setSessions([]);
            });
    }, [navigate]);

    const handleViewSession = (id) => {
        navigate(`/view-session/${id}`);
    };

    const handleBack = () => {
        navigate("/session-management");
    };

    return (
        <div className="session-history-container">
            <h1 className="session-history-title">Apmācību sesiju vēsture</h1>
            {sessions.length === 0 && <div>Neviena sesija nav pabeigta</div>}
            <div className="session-history-grid">
                {sessions.map(session => (
                    <div className="session-history-card" key={session._id}>
                        <div><strong>Datums:</strong> {new Date(session.startDateTime).toLocaleString()} - {new Date(session.endDateTime).toLocaleString()}</div>
                        <div><strong>Grupa:</strong> {session.group.title}</div>
                        <div>
                            <button className="session-history-button" onClick={() => handleViewSession(session._id)}>Apskatīt</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="session-history-back-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default SessionHistory;