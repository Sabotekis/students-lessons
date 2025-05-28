import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./attendance.css";
import { useTranslation } from "react-i18next";

const ViewAttendanceHistory = () => {
    const { id } = useParams();
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/attendance/history/${id}`, { credentials: "include" })
            .then(response => response.json())
            .then(data => setAttendances(data))
            .catch(error => console.error("Error fetching students:", error));
    }, [id]);

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="view-attendance-container">
            <h1 className="view-attendance-title">{t("attendance_history_title")}</h1>
            {attendances.length === 0 ? (
                <div>{t("attendance_none")}</div>
            ) : (
                <div className="view-attendance-history-grid">
                    {attendances.map(attendance => (
                        <div className="view-attendance-history-card" key={attendance._id}>
                            <div><strong>{t("session_start_date")}:</strong> {new Date(attendance.session.startDateTime).toLocaleString()}</div> 
                            <div><strong>{t("session_end_date")}</strong> {new Date(attendance.session.endDateTime).toLocaleString()}</div>
                            <div><strong>{t("group")}:</strong> {attendance.session.group?.title || "N/A"}</div>
                            <div><strong>{t("time_minute")}:</strong> {attendance.timeMinute}</div>
                            <div><strong>{t("group_academic_hours")}:</strong> {attendance.academicHours}</div>
                        </div>
                    ))}
                </div>
            )}
            <button className="view-attendance-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default ViewAttendanceHistory;