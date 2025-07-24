import {useEffect, useState} from "react";
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const GroupRegister = () => {
    const { groupId } = useParams();
    const [registerData, setRegisterData] = useState([]);
    const [groupInfo, setGroupInfo] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/groups/${groupId}/register`)
            .then(response => response.json())
            .then(data => setRegisterData(data))
            .catch(error => console.error("Error fetching group register data:", error));
        fetch(`/api/groups/${groupId}`)
            .then(response => response.json())
            .then(data => setGroupInfo(data))
            .catch(error => console.error("Error fetching group info:", error));
    }, [groupId]);

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("group_register")}</h1>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col xs={12}>
                    <div className="table-responsive" style={{ maxWidth: '500px' }}>
                        <Table striped bordered size="sm" className="mb-0">
                           <tbody>
                                <tr>
                                    <th>{t("group_register_no")}</th>
                                    <td>{groupInfo.registerNumber}</td>
                                </tr>
                                <tr>
                                    <th>{t("group_register_name")}</th>
                                    <td>{groupInfo.title}</td>
                                </tr>
                                <tr>
                                    <th>{t("group_academic_hours")}</th>
                                    <td>{groupInfo.academicHours}</td>
                                </tr>
                                <tr>
                                    <th>{t("period_of_study")}</th>
                                    <td>{new Date(groupInfo.startDate).toLocaleDateString("lv-LV")} - {new Date(groupInfo.endDate).toLocaleDateString("lv-LV")}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>{t("name_and_surname")}</th>
                                    <th>{t("student_personal_code")}</th>
                                    <th>{t("included/not_included")}</th>
                                    <th>{t("education_document_type")}</th>
                                    <th>{t("education_document_number")}</th>
                                    <th>{t("education_document_issue_date")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registerData.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.name}</td>
                                        <td>{student.personalCode}</td>
                                        <td>{student.status}</td>
                                        <td>{student.certificateType}</td>                                            <td>{student.certificateNumber}</td>
                                        <td>{student.issueDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row> 
            
            <Row className="mt-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        <Button variant="danger" onClick={handleBack}>
                            {t("back")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>

    );
};

export default GroupRegister;
