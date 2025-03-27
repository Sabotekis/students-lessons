import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddAttendance = () => {
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [attendance, setAttendance] = useState({ groupId: "", sessionId: "", timeMinute: "", academicHours: "" });
    const navigate = useNavigate();
    const location = useLocation();
    const { studentId } = location.state || {}; 

    useEffect(() => {
        if (!studentId) return;

        fetch(`/api/students/${studentId}`)
            .then(response => response.json())
            .then(data => {
                if (data.groups) {
                    setFilteredGroups(data.groups); 
                }
            })
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
            !session.attendances.some(attendance => attendance.student.toString() === studentId)
        );
        setFilteredSessions(groupSessions);
    };

    const handleAddAttendance = () => {
        if (!attendance.groupId || !attendance.sessionId || !attendance.timeMinute || !attendance.academicHours) {
            alert("All fields are required");
            return;
        }

        fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...attendance, studentId }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message);
                    });
                }
                return response.json();
            })
            .then(() => navigate("/attendance-management"))
            .catch(error => alert(error.message));
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="add-attendance-container">
            <h1 className="add-attendance-title">Add Attendance</h1>
            <div>
                <select
                    className="add-attendance-select"
                    onChange={(e) => handleGroupChange(e.target.value)}
                    value={attendance.groupId}
                >
                    <option value="">Select Group</option>
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
                    <option value="">Select Session</option>
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
                    placeholder="Time (minutes)"
                    value={attendance.timeMinute}
                    onChange={(e) => setAttendance({ ...attendance, timeMinute: e.target.value })}
                />
            </div>
            <div>
                <input
                    className="add-attendance-input"
                    type="number"
                    placeholder="Academic Hours"
                    value={attendance.academicHours}
                    onChange={(e) => setAttendance({ ...attendance, academicHours: e.target.value })}
                />
            </div>
            <button className="add-attendance-button" onClick={handleAddAttendance}>Add Attendance</button>
            <button className="add-attendance-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default AddAttendance;