import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './sessions.css';

const ViewSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSession(data))
            .catch(error => {
                console.error('Error fetching session:', error);
            });
    }, [id]);

    const handleBack = () => {
        navigate("/session-management");
    };

    if (!session) {
        return <div className="view-session-container"><div>Loading...</div></div>;
    }
    
    return (
        <div className="view-session-container">
            <h1 className="view-session-title">View Session</h1>
            <div>
                <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
            </div>
            <div>
                <strong>Group:</strong>
                <div className="view-session-group-grid">
                    <div className="view-session-group-card">
                        <div><strong>Title:</strong> {session.group.title}</div>
                        <div><strong>Start date:</strong> {new Date(session.group.start_date).toLocaleDateString()}</div>
                        <div><strong>End Date:</strong> {new Date(session.group.end_date).toLocaleDateString()}</div>
                        <div><strong>Professor:</strong> {session.group.professor}</div>
                    </div>
                </div>
            </div>
            <div>
                <strong>Students:</strong>
                {session.students.length === 0 && <div>No students</div>}
                <div className="view-session-student-grid">
                    {session.students.map(student => (
                        <div className="view-session-student-card" key={student._id}>
                            <div><strong>Name:</strong> {student.name}</div>
                            <div><strong>Surname:</strong> {student.surname}</div>
                            <div><strong>Personal code:</strong> {student.personal_code}</div>
                            {student.deleted && (
                                <div>(This student is deleted)</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {!session.finished && (
                <>
                    <button className="view-session-button" onClick={() => navigate(`/edit-session/${id}`)}>Edit</button>
                    <button className="view-session-button" onClick={() => {
                        fetch(`/api/sessions/${id}`, { method: "DELETE" })
                            .then(() => navigate("/session-management"));
                    }}>Delete</button>
                </>
            )}
            <button className="view-session-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default ViewSession;