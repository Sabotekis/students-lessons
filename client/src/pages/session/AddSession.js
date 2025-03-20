import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './sessions.css';

const AddSession = () => {
    const [session, setSession] = useState({ date: "" });
    const [groups, setGroup] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroup(data))
            .catch(error => { console.error('Error fetching group data:', error); });
    }, []);

    const handleAddSession = () => {
        if (!session.date || !session.group) {
            alert("All fiels are required");
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
        .catch(error => { console.error('Error adding session:', error); });
    }

    const handleBack = () => {
        navigate("/session-management");
    }


    return (
        <div className="add-session-container">
            <h1 className="add-session-title">Add Session</h1>
            <div>
                <input
                    className="add-session-input"
                    type="date"
                    placeholder="Date"
                    value={session.date}
                    onChange={(e) => setSession({ ...session, date: e.target.value })}
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
                    {groups.map(group => (
                        <option key={group._id} value={group._id}>{group.title}</option>
                    ))}
                </select>
            </div>
            <button className="add-session-button" onClick={handleAddSession}>Add Session</button>
            <button className="add-session-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default AddSession;