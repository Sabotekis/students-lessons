import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './sessions.css';

const EditSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState({ date: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSession({
                ...data,
                date: data.date.slice(0, 10)
            }))
            .catch(error => {
                console.error('Error fetching session:', error);
                setError('Error fetching session');
            });
    }, [id]);

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

    return (
        <div className="edit-session-container">
            <h1 className="edit-session-title">Edit Session</h1>
            {error && <div className="error">{error}</div>}
            <div>
                <input
                    className="edit-session-input"
                    type="date"
                    placeholder="Date"
                    value={session.date}
                    onChange={(e) => setSession({ ...session, date: e.target.value })}
                    required
                />
            </div>
            <button className="edit-session-button" onClick={handleUpdateSession}>Update Session</button>
        </div>
    );
};

export default EditSession;