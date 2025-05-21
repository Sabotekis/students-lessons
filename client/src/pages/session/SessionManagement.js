import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../msalConfig";

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
                    !signedInGoogle ? (
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
                {
                    !signedInMicrosoft ? (
                        <button className="session-history-management-button" onClick={handleMicrosoftLogin}>
                            Ienākt ar Microsoft
                        </button>
                    ) : (
                        <>
                            <button className="session-history-management-button" onClick={handleAddSessionsToMicrosoftCalendar}>
                                Sinhronizē ar Microsoft kalendāru
                            </button>
                            <button className="session-history-management-button" onClick={handleMicrosoftLogout}>
                                Iziet no Microsoft
                            </button>
                        </>
                    )
                }
            </div>
    );
};

export default SessionManagement;