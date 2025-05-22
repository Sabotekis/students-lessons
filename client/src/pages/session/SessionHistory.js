import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';
import { useTranslation } from "react-i18next";

const SessionHistory = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            <h1 className="session-history-title">{t("session_history_title")}</h1>
            {sessions.length === 0 && <div>{t("session_history_none")}</div>}
            <div className="session-history-grid">
                {sessions.map(session => (
                    <div className="session-history-card" key={session._id}>
                        <div><strong>{t("session_start_date")}:</strong> {new Date(session.startDateTime).toLocaleString()}</div>
                        <div><strong>{t("session_end_date")}:</strong> {new Date(session.endDateTime).toLocaleString()}</div>
                        <div><strong>{t("group")}:</strong> {session.group.title}</div>
                        <div>
                            <button className="session-history-button" onClick={() => handleViewSession(session._id)}>{t("view")}</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="session-history-back-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default SessionHistory;