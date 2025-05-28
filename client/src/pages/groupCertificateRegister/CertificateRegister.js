import { useEffect, useState } from "react";
import './groupCertificate.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const CertificateRegister = () => {
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/certificates/register")
            .then(response => response.json())                
            .then(data => setCertificates(data))
            .catch(error => console.error("Error fetching group register data:", error));
    }, []);

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <div className="certificate-register-container">
            <h1 className="certificate-register-title">{t("certificate_register")}</h1>
            <table className="certificate-register-table">
                <thead>
                    <tr>
                        <th>{t("number")}</th>
                        <th>{t("education_document_type")}</th>
                        <th>{t("education_document_number")}</th>
                        <th>{t("name_and_surname")}</th>
                        <th>{t("student_personal_code")}</th>
                        <th>{t("education_program")}</th>
                        <th>{t("period_of_study")}</th>
                        <th>{t("group_number")}</th>
                        <th>{t("issue_date")}</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map((certificate, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{certificate.certificateType}</td>
                            <td>{certificate.certificateNumber}</td>
                            <td>{certificate.studentName}</td>
                            <td>{certificate.personalCode}</td>
                            <td>{certificate.group}</td>
                            <td>{certificate.period}</td>
                            <td>{certificate.registerNumber}</td>
                            <td>{certificate.issueDate}</td>
                        </tr>
                    ))}
                </tbody>
                </table>    
            <button className="certificate-register-button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default CertificateRegister;