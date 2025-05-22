import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './sessions.css';
import { useTranslation } from "react-i18next";

const EditSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState({ date: "", group: "", students: [] });
    const [groupStudents, setGroupStudents] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => response.json())
            .then(data => {
                setSession({
                    ...data,
                    startDateTime: data.startDateTime.slice(0, 10),
                    endDateTime: data.endDateTime.slice(0, 10),
                    group: data.group?._id || "",
                    students: data.students.map(student => student._id)
                });
            })
            .catch(error => console.error('Error fetching session:', error));
    }, [id]);

    useEffect(() => {
        if (session.group) {
            fetch(`/api/groups/${session.group}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students || []))
                .catch(error => console.error('Error fetching group students:', error));
        }
    }, [session.group]);

    const handleUpdateSession = () => {
        fetch(`/api/sessions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(session)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/session-management");
        })
        .catch(error => console.error('Error updating session:', error));
    };

    const handleBack = () => {
        navigate("/session-management");
    };

    const handleAddStudentToSession = (studentId) => {
        if (!session.students.includes(studentId)) {
            setSession(prevSession => ({
                ...prevSession,
                students: [...prevSession.students, studentId]
            }));
        }
    };

    const handleRemoveStudentFromSession = (studentId) => {
        setSession(prevSession => ({
            ...prevSession,
            students: prevSession.students.filter(id => id !== studentId)
        }));
    };

    return (
        <div className="edit-session-container">
            <h1 className="edit-session-title">{t("edit_session_title")}</h1>
            {groupStudents.length > 0 ? (
                <div>
                    <div className="edit-session-student-grid">
                        {groupStudents.map(student => (
                            <div className="edit-session-student-card" key={student._id}>
                                <div><strong>{t("student_name")}:</strong> {student.name}</div>
                                <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                                <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                                <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                                <div><strong>{t("student_email")}:</strong> {student.email}</div>
                                {student.deleted ? (
                                    <div>({t("student_deleted")})</div>
                                ) : session.students.includes(student._id) ? (
                                    <button className="edit-session-delete-button" onClick={() => handleRemoveStudentFromSession(student._id)}>{t("remove")}</button>
                                ) : (
                                    <button className="edit-session-add-button" onClick={() => handleAddStudentToSession(student._id)}>{t("add")}</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>{t("student_none")}</div>
            )}
            <button className="edit-session-button" onClick={handleUpdateSession}>{t("update")}</button>
            <button className="edit-session-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default EditSession;