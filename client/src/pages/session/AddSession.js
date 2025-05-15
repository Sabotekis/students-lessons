import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const AddSession = () => {
    const [session, setSession] = useState({ startDateTime: "", endDateTime: "", group: "", students: [] });
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

    // const handleDateChange = (e) => {
    //     const newDate = e.target.value;
    //     setSession((prevSession) => {
    //         const selectedGroup = groups.find(group => group._id === prevSession.group);
    //         if (selectedGroup) {
    //             const groupStartDate = new Date(selectedGroup.startDate);
    //             const groupEndDate = new Date(selectedGroup.endDate);
    //             const sessionDate = new Date(newDate);

    //             if (sessionDate < groupStartDate || sessionDate > groupEndDate) {
    //                 return { ...prevSession, date: newDate, group: "", students: [] };
    //             }
    //         }
    //         return { ...prevSession, date: newDate };
    //     });
    // };

    const filteredGroups = groups.filter(group => {
        const sessionStart = new Date(session.startDateTime);
        const sessionEnd = new Date(session.endDateTime);
        const groupStartDate = new Date(group.startDate);
        const groupEndDate = new Date(group.endDate);
        return sessionStart >= groupStartDate && sessionEnd <= groupEndDate;
    });

    return (
        <div className="add-session-container">
            <h1 className="add-session-title">Apmācību sesiju pievienošana</h1>
            {/* <div>
                <input
                    className="add-session-input"
                    type="date"
                    placeholder="Datums"
                    value={session.date}
                    onChange={handleDateChange}
                    required
                />
            </div> */}
            <div>
                <input
                    className="add-session-input"
                    type="datetime-local"
                    placeholder="Sākuma datums un laiks"
                    value={session.startDateTime}
                    onChange={e => setSession({ ...session, startDateTime: e.target.value })}
                />
            </div>
            <div>
                <input
                    className="add-session-input"
                    type="datetime-local"
                    placeholder="Beigu datums un laiks"
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
                    <option value="">Izvēlies grupu</option>
                    {filteredGroups.map(group => (
                        <option key={group._id} value={group._id}>{group.title}</option>
                    ))}
                </select>
            </div>
            {students.length > 0 ? (
                <div>
                    {session.students.length !== students.length ? ( 
                        <button className="add-session-add-button" onClick={handleAddAllStudentsToSession}>Pievienot visus</button>
                    ) : (
                        <button className="add-session-delete-button" onClick={handleRemoveAllStudentsFromSession}>Noņemt visus</button>
                    )}
                    <h2>Studenti:</h2>
                    <div className="add-session-student-grid">
                        {students.map(student => (
                            <div className="add-session-student-card" key={student._id}>
                                <div><strong>Vārds:</strong> {student.name}</div>
                                <div><strong>Uzvārds:</strong> {student.surname}</div>
                                <div><strong>Personas kods:</strong> {student.personalCode}</div>
                                <div><strong>Telefona numurs:</strong> {student.phoneNumber}</div>
                                <div><strong>E-pasts:</strong> {student.email}</div>
                                {session.students.includes(student._id) ? (
                                    <button className="add-session-delete-button" onClick={() => handleRemoveStudentFromSession(student._id)}>Izdzēst</button>
                                ) : (
                                    <button className="add-session-add-button" onClick={() => handleAddStudentToSession(student._id)}>Pievienot</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ):(
                <div>Šajā grupā nav studentu vai grupa nav izvēlēta</div>
            )}
            <button className="add-session-button" onClick={handleAddSession}>Pievienot sesiju</button>
            <button className="add-session-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default AddSession;