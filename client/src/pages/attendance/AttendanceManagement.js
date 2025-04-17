import React, { useState, useEffect } from "react";
import "./attendance.css";
import { useNavigate } from "react-router-dom";

const AttendanceManagement = () => {
    const [students, setStudents] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/students", { credentials: "include" })
            .then(response => response.json())
            .then(data => setStudents(data))
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
            <div className="attendance-student-grid">
                {students.length === 0 && <h2 className="attendance-title">Nav atrasti studenti</h2>}
                {students.map(student => (
                    <div className="attendance-student-card" key={student._id}>
                        <div><strong>Vārds:</strong> {student.name}</div>
                        <div><strong>Uzvārds:</strong> {student.surname}</div>
                        <div><strong>Personas kods:</strong> {student.personalCode}</div>
                        <div><strong>Tālruņa numurs:</strong> {student.phoneNumber}</div>
                        <div><strong>E-pasts:</strong> {student.email}</div>
                        <div><strong>Akadēmiskās stundas:</strong> {student.totalAcademicHours}</div>
                        <button className="attendance-button" onClick={() => handleViewAttendanceHistory(student._id)}>Apmeklējuma vēsturi</button>
                        <button className="attendance-button" onClick={() => handleAddAttendance(student._id)}>Pievienot apmeklējumu</button>
                    </div>
                ))}
            </div>
            <button className="attendance-button" onClick={handelUploadFile}>Apmeklējuma augšupielāde</button>
            <button className="attendance-button" onClick={handleAttendanceReport}>Apmeklējuma atskaite</button>    
            <button className="attendance-button" onClick={handelAttendanceGroupReport}>Apmeklējuma grupas atskaite</button>
        </div>
    );
};

export default AttendanceManagement;