import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SessionHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/sessions/finished", { credentials: "include" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Session history data:', data);
                if (Array.isArray(data)) {
                    setSessions(data);
                } else if (data && Array.isArray(data.sessions)) {
                    setSessions(data.sessions);
                } else {
                    console.error('Expected array but got:', typeof data, data);
                    setSessions([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching session history:", error);
                setSessions([]);
                setLoading(false);
            });
    }, []);

    const handleViewSession = (id) => {
        navigate(`/view-session/${id}`);
    };

    const handleBack = () => {
        navigate("/session-management");
    };

    if (loading) {
        return (
            <Container fluid className="mt-4">
                <div className="text-center">
                    <h4>Loading...</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("session_history_title")}</h1>
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                {sessions.map(session => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={session._id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Text><strong>{t("session_start_date")}:</strong> {new Date(session.startDateTime).toLocaleString()}</Card.Text>
                                <Card.Text><strong>{t("session_end_date")}:</strong> {new Date(session.endDateTime).toLocaleString()}</Card.Text>
                                <Card.Text><strong>{t("group_name")}:</strong> {session.group?.title || 'N/A'}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-grid gap-2">
                                    <Button variant="success" onClick={() => handleViewSession(session._id)}>
                                        {t("view")}
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <Button variant="danger" onClick={handleBack} size="lg">
                        {t("back")}
                    </Button>
                </Col>
            </Row>

            {sessions.length === 0 && !loading && (
                <Row>
                    <Col xs={12}>
                        <div className="text-center mt-5">
                            <h4>{t("no_sessions_found")}</h4>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default SessionHistory;