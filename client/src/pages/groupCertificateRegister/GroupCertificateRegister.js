import React from "react";
import './groupCertificate.css';
import { useNavigate } from "react-router-dom";


const GroupCertificateRegister = () => {
    const navigate = useNavigate();

    const handleGroupRegister = () => {
        navigate("/group-register-management");
    };

    const handleCertificateRegister = () => {
        navigate("/certificate-register");
    };

    return (
        <div className="group-certificate-register-container">
            <h1 className="group-certificate-register-title">Grupu un Apliecību Reģistrs</h1>
            <button className="group-certificate-register-button" onClick={handleGroupRegister}>
                Grupu reģistrs
            </button>
            <button className="group-certificate-register-button" onClick={handleCertificateRegister}>
                Apliecību reģistrs
            </button>
        </div>
    );
};

export default GroupCertificateRegister;