import { useState, useEffect } from "react";
import "./attendance.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AttendanceManagement = () => {
    const [students, setStudents] = useState([]); 
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/students", { credentials: "include" })
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => {
                console.error("Error fetching students:", error);
                setStudents([]);
            });
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleAddAttendance = (studentId) => {
        navigate("/add-attendance", { state: { studentId } });
    };

    const handleViewAttendanceHistory = (id) => {
        navigate(`/view-attendance-history/${id}`);
    };

    const handelUploadFile = () => {
        navigate("/upload-attendance");
    };

    const handleAttendanceReport = () => {
        navigate("/attendance-report-management");
    };

    const handelAttendanceGroupReport = () => {
        navigate("/attendance-group-report-management");
    };

    return (
        <div className="attendance-container">
            <h1 className="attendance-title">{t("attendance_title")}</h1>
            <div className="attendance-student-grid">
                {students.length === 0 && <div>{t("student_none")}</div>}
                {students.map(student => (
                    <div className="attendance-student-card" key={student._id}>
                        <div><strong>{t("student_name")}:</strong> {student.name}</div>
                        <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                        <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                        <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                        <div><strong>{t("student_email")}:</strong> {student.email}</div>
                        <div><strong>{t("student_academic_hours")}:</strong> {student.totalAcademicHours}</div>
                        <button className="attendance-button" onClick={() => handleViewAttendanceHistory(student._id)}>{t("attendance_history")}</button>
                        {hasPermission('attendances.create') && <button className="attendance-button" onClick={() => handleAddAttendance(student._id)}>{t("attendance_add")}</button>}
                    </div>
                ))}
            </div>
            {hasPermission('attendances.upload') && <button className="attendance-button" onClick={handelUploadFile}>{t("attendance_upload")}</button>}
            <button className="attendance-button" onClick={handleAttendanceReport}>{t("attendance_report")}</button>    
            <button className="attendance-button" onClick={handelAttendanceGroupReport}>{t("attendance_group_report")}</button>
        </div>
    );
};

export default AttendanceManagement;