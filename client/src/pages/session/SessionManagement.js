import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../msalConfig";
import { useTranslation } from "react-i18next";

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { instance } = useMsal();
    const [signedInGoogle, setSignedInGoogle] = useState(() => {
        return localStorage.getItem('googleSignedIn') === 'true';
    });
    const [signedInMicrosoft, setSignedInMicrosoft] = useState(() => {
        return localStorage.getItem('microsoftSignedIn') === 'true';
    });
    const { t } = useTranslation();

    
    useEffect(() => {
        fetch("/api/sessions", { credentials: "include" })
            .then(response => response.json())
            .then(data => setSessions(data))
            .catch(error => console.error("Error fetching sessions:", error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);

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

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (response) => {
            const { code } = response;
            fetch('/api/google/create-tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })
            .then(res => res.json())
            .then(data => {
                setSignedInGoogle(true);
                localStorage.setItem('googleSignedIn', 'true');            
            })
            .catch(error => console.log(error.message));
        },
        onError: (error) => {
            console.log(error);
        },
        scope: 'openid email profile https://www.googleapis.com/auth/calendar',
        access_type: 'offline',
        response_type: 'code',
    });

    const handleGoogleLogout = () => {
        setSignedInGoogle(false);
        localStorage.removeItem('googleSignedIn');
        alert("Iziet no Google");
    };

    const handleAddSessionsToGoogleCalendar = async () => {
        const response = await fetch("/api/sessions", { credentials: "include" });
        const sessions = await response.json();

        const events = sessions.map(session => ({
            summary: session.group.title,
            description: "",
            location: "Riga, Latvia",
            startDateTime: session.startDateTime,
            endDateTime: session.endDateTime,
        }));

        await fetch('/api/google/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events }),
        });

        alert("Sesijas sinhronizētas ar Google kalendāram");
    };

    const handleMicrosoftLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                setSignedInMicrosoft(true);
                localStorage.setItem('microsoftSignedIn', 'true');
            })
            .catch(e => {
                console.error(e);
            });
    };

    const handleMicrosoftLogout = () => {
        instance.logoutPopup();
        setSignedInMicrosoft(false);
        localStorage.removeItem('microsoftSignedIn');
    };

    const handleAddSessionsToMicrosoftCalendar = async () => {
        const accounts = instance.getAllAccounts();
        if (!accounts.length) {
            alert("Jums jāienāk ar Microsoft kontu!");
            return;
        }
        const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        });
        const accessToken = response.accessToken;

        await fetch('/api/microsoft/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken }),
        });

        alert("Sesijas sinhronizētas ar Microsoft kalendāru");
    };

    return (
            <div className="session-container">
                <h1 className="session-title">{t("session_title")}</h1>
                <div className="session-grid">
                    {sessions.map(session => (
                        <div className="session-card" key={session._id}>
                            <div><strong>{t("session_start_date")}:</strong> {new Date(session.startDateTime).toLocaleString()}</div>
                            <div><strong>{t("session_end_date")}:</strong> {new Date(session.endDateTime).toLocaleString()}</div>
                            <div><strong>{t("group_name")}:</strong> {session.group.title}</div>
                            <div>
                                <button className="session-button" onClick={() => handleViewSession(session._id)}>{t("view")}</button>
                                {hasPermission('sessions.update') && <button className="session-button" onClick={() => handleEditSession(session._id)}>{t("edit")}</button>}
                                {hasPermission('sessions.finish') && <button className="session-button" onClick={() => handleFinishSession(session._id)}>{t("session_finish")}</button>}    
                                {hasPermission('sessions.delete') && <button className="session-button" onClick={() => handleDeleteSession(session._id)}>{t("delete")}</button>}
                            </div>
                        </div>
                    ))}
                    {hasPermission("sessions.create") && (
                        <div className="addbuttoncard">
                            <button className="session-button" onClick={handleAddSession}>{t("session_add")}</button>
                        </div>
                    )}
                </div>
                <button className="session-history-management-button" onClick={handleSessionHistory}>{t("session_history")}</button>
                {hasPermission('sessions.google') && <h3 className="calendar-title">{t("google_calendar")}:</h3>}
                {hasPermission('sessions.google') && <div>
                    {
                        !signedInGoogle ? (
                            <button className="session-history-management-button" onClick={handleGoogleLogin}>
                                {t("google_login")}
                            </button>
                        ) : (
                            <>
                                <button className="session-history-management-button" onClick={handleAddSessionsToGoogleCalendar}>
                                    {t("sync_google_calendar")}
                                </button>
                                <button className="session-history-management-button" onClick={handleGoogleLogout}>
                                    {t("google_logout")}
                                </button>
                            </>
                        )
                    }
                </div>}
                {hasPermission('sessions.microsoft') && <h3 className="calendar-title">{t("microsoft_calendar")}:</h3>}
                {hasPermission('sessions.microsoft') && <div>
                    {
                        !signedInMicrosoft ? (
                            <button className="session-history-management-button" onClick={handleMicrosoftLogin}>
                                {t("microsoft_login")}
                            </button>
                        ) : (
                            <>
                                <button className="session-history-management-button" onClick={handleAddSessionsToMicrosoftCalendar}>
                                    {t("sync_microsoft_calendar")}
                                </button>
                                <button className="session-history-management-button" onClick={handleMicrosoftLogout}>
                                    {t("microsoft_logout")}
                                </button>
                            </>
                        )
                    }
                </div>}
            </div>
    );
};

export default SessionManagement;