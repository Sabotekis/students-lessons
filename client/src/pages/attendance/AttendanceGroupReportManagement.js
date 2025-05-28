import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./attendance.css";
import { useTranslation } from "react-i18next";

const AttendanceGroupReportManagement = () => {
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

    const handleGenerateReport = () => {
        if (!selectedGroup) {
            alert("Izvēlieties grupu");
            return;
        }

        navigate(`/attendance-group-report/${selectedGroup}`);
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="attendance-group-report-management-container">
            <h1 className="attendance-group-report-management-title">{t("attendance_group_report_management_title")}</h1>
            <div>
                <select
                    className="attendance-group-report-management-select"
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
            <button className="attendance-group-report-management-button" onClick={handleGenerateReport}>
                {t("generate")}
            </button>
            <button className="attendance-group-report-management-button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default AttendanceGroupReportManagement;