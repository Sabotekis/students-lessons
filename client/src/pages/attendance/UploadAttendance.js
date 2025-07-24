import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadAndAddAttendance = async () => {
        if (!file) {
            alert('Vispirms pievienojiet failu');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadResponse = await fetch('/api/attendance/upload-csv', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                alert('Kļūda augšupielādējot failu: ' + uploadData.message);
                return;
            }

            const { meetingTitle, startTime, presenters } = uploadData;

            const attendanceResponse = await fetch('/api/attendance/upload-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetingTitle, startTime, presenters }),
            });

            const attendanceData = await attendanceResponse.json();

            if (!attendanceResponse.ok) {
                alert('Kļūda, pievienojot apmeklējumu: ' + attendanceData.message);
                return;
            }

            navigate('/attendance-management'); 
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Apstrādājot failu, ir notikusi kļūda');
        }
    };

    const handleBack = () => {
        navigate('/attendance-management');
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("upload_attendance_title")}</h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button variant="success" onClick={handleUploadAndAddAttendance} className="me-2">
                                        {t("add")}
                                    </Button>
                                    <Button variant="danger" onClick={handleBack} className="me-2">
                                        {t("back")}
                                    </Button>  
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UploadFile;