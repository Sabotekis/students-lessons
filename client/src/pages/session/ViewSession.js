import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './sessions.css';
import { useTranslation } from "react-i18next";

const ViewSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => response.json())
            .then(data => setSession(data))
            .catch(error => console.error('Error fetching session:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleBack = () => {
        navigate("/session-management");
    };

    if (!session) {
        return <div className="view-session-container"><div>Loading...</div></div>;
    }

    return (
        <div className="view-session-container">
            <h1 className="view-session-title">{t("view_session_title")}</h1>
            <div><strong>{t("session_start_date")}:</strong> {new Date(session.startDateTime).toLocaleString()}</div>
            <div><strong>{t("session_end_date")}:</strong> {new Date(session.endDateTime).toLocaleString()}</div>
            <div>
                <strong>{t("group")}:</strong>
                <div className="view-session-group-grid">
                    <div className="view-session-group-card">
                        <div><strong>{t("group_register_number")}:</strong> {session.group.registerNumber}</div>
                        <div><strong>{t("group_name")}:</strong> {session.group.title}</div>
                        <div><strong>{t("group_start_date")}:</strong> {new Date(session.group.startDate).toLocaleDateString()}</div>
                        <div><strong>{t("group_end_date")}:</strong> {new Date(session.group.endDate).toLocaleDateString()}</div>
                        <div><strong>{t("group_professor")}:</strong> {session.group.professor}</div>
                        <div><strong>{t("group_academic_hours")}:</strong> {session.group.academicHours}</div>
                        <div><strong>{t("group_min_hours")}:</strong> {session.group.minHours}</div>
                        <div>
                            <strong>{t("group_planned_data")}:</strong>
                            <div className="view-group-planned-data">
                                {Object.entries(session.group.plannedData).map(([month, data]) => (
                                    <div key={month}>
                                        <strong>{month}:</strong> {data.days} {t("days")}, {data.hours} {t("hours")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {session.students.length === 0 ? ( 
                    <div></div>
                ) : (
                    <div>
                        <strong>{t("students")}:</strong>
                        <div className="view-session-student-grid">
                            {session.students.map(student => {
                                const hasAttendance = session.attendances.some(attendance => 
                                    attendance.student && attendance.student._id === student._id
                                );

                                return (
                                    <div
                                        className={`view-session-student-card ${hasAttendance ? 'attended' : 'not-attended'}`}
                                        key={student._id}
                                    >
                                        <div><strong>{t("student_name")}:</strong> {student.name}</div>
                                        <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                                        <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                                        <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                                        <div><strong>{t("student_email")}:</strong> {student.email}</div>
                                        {student.deleted && (
                                            <div>({t("student_deleted")})</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {!session.finished && (
                <>
                    {hasPermission('sessions.update') && <button className="view-session-button" onClick={() => navigate(`/edit-session/${id}`)}>{t("edit")}</button>}
                    {hasPermission('sessions.delete') && <button className="view-session-button" onClick={() => {
                        fetch(`/api/sessions/${id}`, { method: "DELETE" })
                            .then(() => navigate("/session-management"));
                    }}>{t("delete")}</button>}
                </>
            )}
            <button className="view-session-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default ViewSession;