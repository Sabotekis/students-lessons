import {useEffect, useState} from "react";
import './groupCertificate.css';
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
        <div className="group-register-container">
            <h1 className="group-register-title">{t("group_register")}</h1>
            <table className="group-register-table">
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
            </table>
            <table className="group-register-main-table">
                <thead>
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
                            <td>{student.certificateType}</td>
                            <td>{student.certificateNumber}</td>
                            <td>{student.issueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="group-register-button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default GroupRegister;
