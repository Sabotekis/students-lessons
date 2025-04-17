import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./attendance.css";

const ViewAttendanceHistory = () => {
    const { id } = useParams();
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/attendance/history/${id}`, { credentials: "include" })
            .then(response => response.json())
            .then(data => setAttendances(data))
            .catch(error => console.error("Error fetching students:", error));
    }, [id]);

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="view-attendance-container">
            <h1 className="view-attendance-title">Apmeklējuma vēsture</h1>
            {attendances.length === 0 ? (
                <div>Nav atrasti apmeklējumi</div>
            ) : (
                <div className="view-attendance-history-grid">
                    {attendances.map(attendance => (
                        <div className="view-attendance-history-card" key={attendance._id}>
                            <div><strong>Sesijas datums:</strong> {new Date(attendance.session.date).toLocaleDateString()}</div>
                            <div><strong>Grupa:</strong> {attendance.session.group?.title || "N/A"}</div>
                            <div><strong>Laiks (minutēs):</strong> {attendance.timeMinute}</div>
                            <div><strong>Akadēmiskās stundas:</strong> {attendance.academicHours}</div>
                        </div>
                    ))}
                </div>
            )}
            <button className="view-attendance-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default ViewAttendanceHistory;