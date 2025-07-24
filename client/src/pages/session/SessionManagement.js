import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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
            .then(data => {
                console.log('Sessions data:', data); // Debug log
                setSessions(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Error fetching sessions:", error);
                setSessions([]);
            });
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
                .then(data => setSessions(Array.isArray(data) ? data : []));
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
                .then(data => setSessions(Array.isArray(data) ? data : []));
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
            summary: session.group?.title || 'Unknown Group',
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
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("session_title")}</h1>
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                {sessions.map(session => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={session._id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("session_start_date")}:</strong> {session.startDateTime ? new Date(session.startDateTime).toLocaleString() : 'N/A'}</Card.Text>
                                <Card.Text><strong>{t("session_end_date")}:</strong> {session.endDateTime ? new Date(session.endDateTime).toLocaleString() : 'N/A'}</Card.Text>
                                <Card.Text><strong>{t("group_name")}:</strong> {session.group?.title || session.groupTitle || 'N/A'}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-grid gap-2">
                                    <Button variant="success" onClick={() => handleViewSession(session._id)}>
                                        {t("view")}
                                    </Button>
                                    {hasPermission('sessions.update') && (
                                        <Button variant="success" onClick={() => handleEditSession(session._id)}>
                                            {t("edit")}
                                        </Button>
                                    )}
                                    {hasPermission('sessions.finish') && (
                                        <Button variant="success" onClick={() => handleFinishSession(session._id)}>
                                            {t("session_finish")}
                                        </Button>
                                    )}
                                    {hasPermission('sessions.delete') && (
                                        <Button variant="danger" onClick={() => handleDeleteSession(session._id)}>
                                            {t("delete")}
                                        </Button>
                                    )}
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
                {hasPermission("sessions.create") && (
                    <Col xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100">
                            <Card.Body className="d-flex align-items-center justify-content-center text-center">
                                <Button variant="success" size="lg" onClick={handleAddSession}>
                                    {t("session_add")}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            <Row className="mb-3">
                <Col xs={12} className="text-center">
                    <Button variant="success" onClick={handleSessionHistory} size="lg">
                        {t("session_history")}
                    </Button>
                </Col>
            </Row>

            {hasPermission('sessions.google') && (
                <Row className="mb-3">
                    <Col xs={12}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">{t("google_calendar")}</h5>
                            </Card.Header>
                            <Card.Body>
                                {!signedInGoogle ? (
                                    <Button variant="outline-primary" onClick={handleGoogleLogin} className="w-100">
                                        {t("google_login")}
                                    </Button>
                                ) : (
                                    <div className="d-grid gap-2 d-md-block text-center">
                                        <Button variant="success" onClick={handleAddSessionsToGoogleCalendar} className="me-2">
                                            {t("sync_google_calendar")}
                                        </Button>
                                        <Button variant="outline-danger" onClick={handleGoogleLogout} className="me-2">
                                            {t("google_logout")}
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {hasPermission('sessions.microsoft') && (
                <Row>
                    <Col xs={12}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">{t("microsoft_calendar")}</h5>
                            </Card.Header>
                            <Card.Body>
                                {!signedInMicrosoft ? (
                                    <Button variant="outline-primary" onClick={handleMicrosoftLogin} className="w-100">
                                        {t("microsoft_login")}
                                    </Button>
                                ) : (
                                    <div className="d-grid gap-2 d-md-block text-center">
                                        <Button variant="success" onClick={handleAddSessionsToMicrosoftCalendar} className="me-2">
                                            {t("sync_microsoft_calendar")}
                                        </Button>
                                        <Button variant="outline-danger" onClick={handleMicrosoftLogout} className="me-2">
                                            {t("microsoft_logout")}
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default SessionManagement;