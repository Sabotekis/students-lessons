import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./attendance.css";
import { useTranslation } from "react-i18next";

const AttendanceReportManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGroupChange = (groupId) => {
        setSelectedGroup(groupId);
        setSelectedMonth("");

        const group = groups.find(g => g._id === groupId);
        if (group) {
            const startDate = new Date(group.startDate);
            const endDate = new Date(group.endDate);
            const months = [];

            while (startDate <= endDate) {
                const year = startDate.getFullYear();
                const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
                months.push(`${year}-${month}`);
                startDate.setMonth(startDate.getMonth() + 1);
            }

            setAvailableMonths(months);
        } else {
            setAvailableMonths([]);
        }
    };

    const handleShowReport = () => {
        if (!selectedGroup || !selectedMonth) {
            alert("Izvēlieties gan grupu, gan mēnesi");
            return;
        }
    
        navigate("/attendance-report", {
            state: {
                groupId: selectedGroup,
                month: selectedMonth,
            },
        });
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="attendance-report-management-container">
            <h1>{t("attendance_report_management_title")}</h1>
            <div className="attendance-report-management-filters">
                <div>
                    <select
                        className="attendance-report-management-select"
                        value={selectedGroup}
                        onChange={(e) => handleGroupChange(e.target.value)}
                    >
                        <option value="">{t("group_choose")}</option>
                        {groups.map(group => (
                            <option key={group._id} value={group._id}>
                                {group.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        className="attendance-report-management-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        disabled={!availableMonths.length}
                    >
                        <option value="">{t("month_choose")}</option>
                        {availableMonths.map(month => (
                            <option key={month} value={month}>
                                {new Date(`${month}-01`).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>  
                <button className="attendance-report-management-button" onClick={handleShowReport}>
                    {t("generate")}
                </button>
                <button className="attendance-report-management-button" onClick={handleBack}>
                    {t("back")}
                </button>
            </div>
        </div>
    );
};

export default AttendanceReportManagement;