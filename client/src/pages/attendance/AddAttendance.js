import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./attendance.css";
import { useTranslation } from "react-i18next";

const AddAttendance = () => {
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [attendance, setAttendance] = useState({ groupId: "", sessionId: "", timeMinute: "", academicHours: 0 });
    const navigate = useNavigate();
    const location = useLocation();
    const { studentId } = location.state || {};
    const { t } = useTranslation();

    useEffect(() => {
        if (!studentId) return;

        fetch(`/api/students/${studentId}`)
            .then(response => response.json())
            .then(data => setFilteredGroups(data.groups))
            .catch(error => console.error("Error fetching student groups:", error));

        fetch("/api/sessions/finished")
            .then(response => response.json())
            .then(data => setSessions(data))
            .catch(error => console.error("Error fetching sessions:", error));
    }, [studentId]);

    const handleGroupChange = (groupId) => {
        setAttendance({ ...attendance, groupId, sessionId: "" });

        const groupSessions = sessions.filter(session =>
            session.group._id === groupId &&
            session.students.some(student => student._id === studentId) &&
            !session.attendances.some(attendance => attendance.student._id.toString() === studentId)
        );
        setFilteredSessions(groupSessions);
    };

    const handleMinutesChange = (minutes) => {
        const academicHours = Math.floor(minutes / 40); 
        setAttendance({ ...attendance, timeMinute: minutes, academicHours });
    };

    const handleAddAttendance = () => {
        if (!attendance.groupId || !attendance.sessionId || !attendance.timeMinute) {
            alert("All fields are required");
            return;
        }
    
        fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                student: studentId,
                session: attendance.sessionId,
                timeMinute: parseInt(attendance.timeMinute, 10),
                academicHours: parseInt(attendance.academicHours, 10),
            }),
        })
            .then(response => response.json())
            .then(() => {
                navigate("/attendance-management");
            })
            .catch(error => alert(error.message));
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="add-attendance-container">
            <h1 className="add-attendance-title">{t("add_attendance_title")}</h1>
            <div>
                <select
                    className="add-attendance-select"
                    onChange={(e) => handleGroupChange(e.target.value)}
                    value={attendance.groupId}
                >
                    <option value="">{t("group_choose")}</option>
                    {filteredGroups.map(group => (
                        <option key={group._id} value={group._id}>
                            {group.title}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select
                    className="add-attendance-select"
                    onChange={(e) => setAttendance({ ...attendance, sessionId: e.target.value })}
                    value={attendance.sessionId}
                    disabled={!attendance.groupId}
                >
                    <option value="">{t("session_choose")}</option>
                    {filteredSessions.map(session => (
                        <option key={session._id} value={session._id}>
                            {new Date(session.date).toLocaleDateString()} - {session.group.title}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input
                    className="add-attendance-input"
                    type="number"
                    placeholder={t("time_minute")}
                    value={attendance.timeMinute}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                />
            </div>
            <div>
                <strong>{t("student_academic_hours")}: {attendance.academicHours}</strong>
            </div>
            <button className="add-attendance-button" onClick={handleAddAttendance}>{t("add")}</button>
            <button className="add-attendance-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default AddAttendance;