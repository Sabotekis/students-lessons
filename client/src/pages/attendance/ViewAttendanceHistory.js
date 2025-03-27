import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./attendance.css";

const ViewAttendanceHistory = () => {
    const { id } = useParams();
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/attendance/history/${id}`, { credentials: "include" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch attendance history");
                }
                return response.json();
            })
            .then(data => setAttendances(data))
            .catch(error => setError(error.message));
    }, [id]);

    const handleBack = () => {
        navigate("/attendance-management");
    };

    if (error) {
        return <div className="attendance-container"><div className="error">{error}</div></div>;
    }

    return (
        <div className="view-attendance-container">
            <h1 className="view-attendance-title">Attendance History</h1>
            {attendances.length === 0 ? (
                <div>No attendance records found</div>
            ) : (
                <div className="view-attendance-history-grid">
                    {attendances.map(attendance => (
                        <div className="view-attendance-history-card" key={attendance._id}>
                            <div><strong>Session Date:</strong> {new Date(attendance.session.date).toLocaleDateString()}</div>
                            <div><strong>Group:</strong> {attendance.session.group?.title || "N/A"}</div>
                            <div><strong>Time (Minutes):</strong> {attendance.time_minute}</div>
                            <div><strong>Academic Hours:</strong> {attendance.academic_hours}</div>
                        </div>
                    ))}
                </div>
            )}
            <button className="view-attendance-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default ViewAttendanceHistory;