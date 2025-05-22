import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';
import { useTranslation } from "react-i18next";

const AddSession = () => {
    const [session, setSession] = useState({ startDateTime: "", endDateTime: "", group: "", students: [] });
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error('Error fetching group data:', error));
    }, []);

    useEffect(() => {
        if (session.group) {
            fetch(`/api/groups/${session.group}`)
                .then(response => response.json())
                .then(data => setStudents(data.students || []))
                .catch(error => console.error('Error fetching students data:', error));
        } else {
            setStudents([]);
        }
    }, [session.group]);

    const handleAddSession = () => {
        if (!session.startDateTime || !session.endDateTime || !session.group) {
            alert("All fields are required");
            return;
        }

        if (new Date(session.startDateTime) > new Date(session.endDateTime)) {
            alert("Sākuma datums un laiks nedrīkst būt pēc beigu datuma un laika");
            return;
        }

        fetch("/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(session)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/session-management");
        })
        .catch(error => console.error('Error adding session:', error));
    };

    const handleBack = () => {
        navigate("/session-management");
    };

    const handleAddStudentToSession = (studentId) => {
        if(!session.students.includes(studentId)) {
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

    const handleAddAllStudentsToSession = () => {
        setSession(prevSession => ({
            ...prevSession,
            students: students.map(student => student._id)
        }));
    }

    const handleRemoveAllStudentsFromSession = () => {
        setSession(prevSession => ({
            ...prevSession,
            students: []
        }));
    };

    const filteredGroups = groups.filter(group => {
        const sessionStart = new Date(session.startDateTime);
        const sessionEnd = new Date(session.endDateTime);
        const groupStartDate = new Date(group.startDate);
        const groupEndDate = new Date(group.endDate);
        return sessionStart >= groupStartDate && sessionEnd <= groupEndDate;
    });

    return (
        <div className="add-session-container">
            <h1 className="add-session-title">{t("add_session_title")}</h1>
            <div>
                <input
                    className="add-session-input"
                    type="datetime-local"
                    placeholder={t("session_start_date")}
                    value={session.startDateTime}
                    onChange={e => setSession({ ...session, startDateTime: e.target.value })}
                />
            </div>
            <div>
                <input
                    className="add-session-input"
                    type="datetime-local"
                    placeholder={t("session_end_date")}
                    value={session.endDateTime}
                    onChange={e => setSession({ ...session, endDateTime: e.target.value })}
                />
            </div>
            <div>
                <select
                    className="add-session-input"
                    value={session.group}
                    onChange={(e) => setSession({ ...session, group: e.target.value })}
                    required
                >
                    <option value="">{t("group_choose")}</option>
                    {filteredGroups.map(group => (
                        <option key={group._id} value={group._id}>{group.title}</option>
                    ))}
                </select>
            </div>
            {students.length > 0 ? (
                <div>
                    {session.students.length !== students.length ? ( 
                        <button className="add-session-add-button" onClick={handleAddAllStudentsToSession}>{t("add_all_students")}</button>
                    ) : (
                        <button className="add-session-delete-button" onClick={handleRemoveAllStudentsFromSession}>{t("remove_all_students")}</button>
                    )}
                    <h2>{t("students")}:</h2>
                    <div className="add-session-student-grid">
                        {students.map(student => (
                            <div className="add-session-student-card" key={student._id}>
                                <div><strong>{t("student_name")}:</strong> {student.name}</div>
                                <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                                <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                                <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                                <div><strong>{t("student_email")}:</strong> {student.email}</div>
                                {session.students.includes(student._id) ? (
                                    <button className="add-session-delete-button" onClick={() => handleRemoveStudentFromSession(student._id)}>{t("remove")}</button>
                                ) : (
                                    <button className="add-session-add-button" onClick={() => handleAddStudentToSession(student._id)}>{t("add")}</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ):(
                <div>{t("student_or_group_none")}</div>
            )}
            <button className="add-session-button" onClick={handleAddSession}>{t("add")}</button>
            <button className="add-session-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default AddSession;