import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './sessions.css';

const EditSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState({ date: "", group: "", students: [] });
    const [error, setError] = useState("");
    const [groupStudents, setGroupStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSession({
                    ...data,
                    date: data.date.slice(0, 10),
                    group: data.group?._id || "",
                    students: data.students.map(student => student._id)
                });
            })
            .catch(error => {
                console.error('Error fetching session:', error);
                setError('Error fetching session');
            });
    }, [id]);

    useEffect(() => {
        if (session.group) {
            fetch(`/api/groups/${session.group}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setGroupStudents(data.students || []))
                .catch(error => {
                    console.error('Error fetching group students:', error);
                    setError('Error fetching group students');
                });
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
        .catch(error => {
            console.error('Error updating session:', error);
            setError('Error updating session');
        });
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
            <h1 className="edit-session-title">Edit Session</h1>
            {error && <div className="error">{error}</div>}
            {groupStudents.length > 0 ? (
                <div>
                    <h2>Students:</h2>
                    <div className="edit-session-student-grid">
                        {groupStudents.map(student => (
                            <div className="edit-session-student-card" key={student._id}>
                                <div><strong>Name:</strong> {student.name}</div>
                                <div><strong>Surname:</strong> {student.surname}</div>
                                <div><strong>Personal Code:</strong> {student.personal_code}</div>
                                {student.deleted ? (
                                    <div>(This student is deleted)</div>
                                ) : session.students.includes(student._id) ? (
                                    <button className="edit-session-delete-button" onClick={() => handleRemoveStudentFromSession(student._id)}>Remove</button>
                                ) : (
                                    <button className="edit-session-add-button" onClick={() => handleAddStudentToSession(student._id)}>Add</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No students in this group</div>
            )}
            <button className="edit-session-button" onClick={handleUpdateSession}>Update Session</button>
            <button className="edit-session-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default EditSession;