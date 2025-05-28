import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groupCertificate.css'
import { useTranslation } from "react-i18next";

const GroupRegisterManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGenerateRegister = () => {
        if (!selectedGroup) {
            alert("Izvēlieties grupu.");
            return;
        }

        navigate(`/group-register/${selectedGroup}`);
    };

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <div className="group-register-management-container">
            <h1 className="group-register-management-title">{t("group_register_management_title")}</h1>
            <div>
                <select
                    className="group-register-management-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">{t("group_choose")}</option>
                    {groups.map(group => (
                        <option key={group._id} value={group._id}>
                            {group.title}
                        </option>
                    ))}
                </select>
            </div>
            <button className="group-register-management-button" onClick={handleGenerateRegister}>
                {t("generate")}
            </button>
            <button className="group-register-management-button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default GroupRegisterManagement;