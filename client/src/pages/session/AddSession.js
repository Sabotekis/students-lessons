import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const AddSession = () => {
    const [session, setSession] = useState({ date: "", group: "", students: [] });
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    
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
        if (!session.date || !session.group) {
            alert("All fields are required");
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

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSession((prevSession) => {
            const selectedGroup = groups.find(group => group._id === prevSession.group);
            if (selectedGroup) {
                const groupStartDate = new Date(selectedGroup.start_date);
                const groupEndDate = new Date(selectedGroup.end_date);
                const sessionDate = new Date(newDate);

                if (sessionDate < groupStartDate || sessionDate > groupEndDate) {
                    return { ...prevSession, date: newDate, group: "", students: [] };
                }
            }
            return { ...prevSession, date: newDate };
        });
    };

    const filteredGroups = groups.filter(group => {
        const sessionDate = new Date(session.date);
        const groupStartDate = new Date(group.start_date);
        const groupEndDate = new Date(group.end_date);
        return sessionDate >= groupStartDate && sessionDate <= groupEndDate;
    });

    return (
        <div className="add-session-container">
            <h1 className="add-session-title">Add Session</h1>
            <div>
                <input
                    className="add-session-input"
                    type="date"
                    placeholder="Date"
                    value={session.date}
                    onChange={handleDateChange}
                    required
                />
            </div>
            <div>
                <select
                    className="add-session-input"
                    value={session.group}
                    onChange={(e) => setSession({ ...session, group: e.target.value })}
                    required
                >
                    <option value="">Select Group</option>
                    {filteredGroups.map(group => (
                        <option key={group._id} value={group._id}>{group.title}</option>
                    ))}
                </select>
            </div>
            {students.length > 0 ? (
                <div>
                    {session.students.length !== students.length ? ( 
                        <button className="add-session-add-button" onClick={handleAddAllStudentsToSession}>Add All</button>
                    ) : (
                        <button className="add-session-delete-button" onClick={handleRemoveAllStudentsFromSession}>Remove All</button>
                    )}
                    <h2>Students:</h2>
                    <div className="add-session-student-grid">
                        {students.map(student => (
                            <div className="add-session-student-card" key={student._id}>
                                <div><strong>Name:</strong> {student.name}</div>
                                <div><strong>Surname:</strong> {student.surname}</div>
                                <div><strong>Personal Code:</strong> {student.personal_code}</div>
                                {session.students.includes(student._id) ? (
                                    <button className="add-session-delete-button" onClick={() => handleRemoveStudentFromSession(student._id)}>Remove</button>
                                ) : (
                                    <button className="add-session-add-button" onClick={() => handleAddStudentToSession(student._id)}>Add</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ):(
                <div>No students in this group</div>
            )}
            <button className="add-session-button" onClick={handleAddSession}>Add Session</button>
            <button className="add-session-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default AddSession;