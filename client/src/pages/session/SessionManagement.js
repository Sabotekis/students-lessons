import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';
import { useGoogleLogin } from '@react-oauth/google';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const [signedIn, setSignedIn] = useState(() => {
        return localStorage.getItem('googleSignedIn') === 'true';
    });

    
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
                setSignedIn(true);
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
        setSignedIn(false);
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
   
    return (
            <div className="session-container">
                <h1 className="session-title">Apmācību sesiju pārvaldība</h1>
                <div className="session-grid">
                    {sessions.map(session => (
                        <div className="session-card" key={session._id}>
                            <div><strong>Datums:</strong> {new Date(session.startDateTime).toLocaleString()} - {new Date(session.endDateTime).toLocaleString()}</div>
                            <div><strong>Grupa:</strong> {session.group.title}</div>
                            <div>
                                <button className="session-button" onClick={() => handleViewSession(session._id)}>Apskatīt</button>
                                {hasPermission('sessions.update') && <button className="session-button" onClick={() => handleEditSession(session._id)}>Rediģēt</button>}
                                {hasPermission('sessions.finish') && <button className="session-button" onClick={() => handleFinishSession(session._id)}>Pabeigt</button>}    
                                {hasPermission('sessions.delete') && <button className="session-button" onClick={() => handleDeleteSession(session._id)}>Izdzēst</button>}
                            </div>
                        </div>
                    ))}
                    {hasPermission("sessions.create") && (
                        <div className="addbuttoncard">
                            <button className="session-button" onClick={handleAddSession}>Pievienot sesiju</button>
                        </div>
                    )}
                </div>
                <button className="session-history-management-button" onClick={handleSessionHistory}>Sesijas vēsture</button>
                {
                    !signedIn ? (
                        <button className="session-history-management-button" onClick={handleGoogleLogin}>
                            Ienākt ar Google
                        </button>
                    ) : (
                        <>
                            <button className="session-history-management-button" onClick={handleAddSessionsToGoogleCalendar}>
                                Sinhronizē ar Google kalendāru
                            </button>
                            <button className="session-history-management-button" onClick={handleGoogleLogout}>
                                Iziet no Google
                            </button>
                        </>
                    )
                }   
            </div>
    );
};

export default SessionManagement;