import './groupCertificate.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const GroupCertificateRegister = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGroupRegister = () => {
        navigate("/group-register-management");
    };

    const handleCertificateRegister = () => {
        navigate("/certificate-register");
    };

    return (
        <div className="group-certificate-register-container">
            <h1 className="group-certificate-register-title">{t("group_and_certificate_register_title")}</h1>
            <button className="group-certificate-register-button" onClick={handleGroupRegister}>
                {t("group_register")}
            </button>
            <button className="group-certificate-register-button" onClick={handleCertificateRegister}>
                {t("certificate_register")}
            </button>
        </div>
    );
};

export default GroupCertificateRegister;