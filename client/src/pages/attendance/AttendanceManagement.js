import React, { useState, useEffect } from "react";
import "./attendance.css";
import { useNavigate } from "react-router-dom";

const AttendanceManagement = () => {
    const [students, setStudents] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/students", { credentials: "include" })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                    return null; 
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setStudents(data);
                }
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                setStudents([]);
            });
    }, [navigate]);

    const handleAddAttendance = (studentId) => {
        navigate("/add-attendance", { state: { studentId } });
    };

    const handleViewAttendanceHistory = (id) => {
        navigate(`/view-attendance-history/${id}`);
    };

    const handelUploadFile = () => {
        navigate("/upload-attendance");
    };

    const handleAttendanceReport = () => {
        navigate("/attendance-report-management");
    };

    const handelAttendanceGroupReport = () => {
        navigate("/attendance-group-report-management");
    };

    return (
        <div className="attendance-container">
            <h1 className="attendance-title">Apmeklējuma uzskaite</h1>
            <h2 className="attendance-title">Studenti:</h2>
            <div className="attendance-student-grid">
                {students.length === 0 && <div>Nav atrasti studenti</div>}
                {students.map(student => (
                    <div className="attendance-student-card" key={student._id}>
                        <div><strong>Name:</strong> {student.name}</div>
                        <div><strong>Surname:</strong> {student.surname}</div>
                        <div><strong>Personal Code:</strong> {student.personal_code}</div>
                        <div><strong>Total Academic Hours:</strong> {student.total_academic_hours}</div>
                        <button className="attendance-button" onClick={() => handleViewAttendanceHistory(student._id)}>View Attendance History</button>
                        <button className="attendance-button" onClick={() => handleAddAttendance(student._id)}>Add Attendance</button>
                    </div>
                ))}
            </div>
            <button className="upload-attendance-button" onClick={handelUploadFile}>Upload File</button>
            <button className="attendance-button" onClick={handleAttendanceReport}>Attendance Report</button>    
            <button className="attendance-button" onClick={handelAttendanceGroupReport}>Attendance Group Report</button>
        </div>
    );
};

export default AttendanceManagement;