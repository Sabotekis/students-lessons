import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './students.css';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state?.groupId;

    useEffect(() => {
        fetch("/api/students", {credentials: "include"})
            .then(response => response.json())
            .then(data => setStudents(data));

        if (groupId) {
            fetch(`/api/groups/${groupId}`, {credentials: "include"})
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));
        }
    }, [groupId, navigate]);

    const handleAddStudent = () => {
        navigate("/add-student");
    };

    const handleEditStudent = (id) => {
        navigate(`/edit-student/${id}`);
    };

    const handleDeleteStudent = (id) => {
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setStudents(students.filter(student => student._id !== id));
        });
    };

    const handleViewStudent = (id) => {
        navigate(`/view-student/${id}`);
    };

    const handleAddStudentToGroup = (studentId) => {
        fetch(`/api/groups/${groupId}/add-student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            fetch("/api/students")
                .then(response => response.json())
                .then(data => setStudents(data));

            fetch(`/api/groups/${groupId}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));

            navigate(`/view-group/${groupId}`);
        })
        .catch(error => {
            console.error('Error adding student to group:', error);
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    const filteredStudents = students
        .filter(student => {
            const value = student[filterBy]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        })
        .filter(student => !groupStudents.some(groupStudent => groupStudent._id === student._id))
        .sort((a, b) => {
            const valueA = (a[filterBy]?.toLowerCase() || "");
            const valueB = (b[filterBy]?.toLowerCase() || "");
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });

    return (
        <div className="student-container">
            <h1 className="student-title">Studentu pārvaldība</h1>
            <div>
                <input 
                    className="student-search-input"
                    type="text"
                    placeholder="Meklēt"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="student-search-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="name">Vārds</option>
                    <option value="surname">Uzvārds</option>
                    <option value="personalCode">Personas kods</option>
                    <option value="phoneNumber">Telefona numurs</option>
                    <option value="email">E-pasts</option>
                </select>
                { groupId && <button className="backbutton" onClick={handleBack}>
                    Atgriezties
                </button>}
            </div>
            <div className="student-grid">
                {groupId && filteredStudents.length === 0 ? (
                    <div>Nav pieejamu studentu</div>
                ) : (
                    filteredStudents.map(student => (
                        <div className="student-card" key={student._id}>
                            <div><strong>Vārds:</strong> {student.name}</div>
                            <div><strong>Uzvārds:</strong> {student.surname}</div>
                            <div><strong>Personas kods:</strong> {student.personalCode}</div>
                            <div><strong>Telefona numurs:</strong> {student.phoneNumber}</div>
                            <div><strong>E-pasts:</strong> {student.email}</div>
                            <div><strong>Akadēmiskās stundas: {student.totalAcademicHours}</strong></div>
                            <div>
                                {groupId ? (
                                    <button className="student-button" onClick={() => handleAddStudentToGroup(student._id)}>Pievienot grupai</button>
                                ) : (
                                    <>
                                        <button className="student-button" onClick={() => handleViewStudent(student._id)}>Apskatīt</button>
                                        <button className="student-button" onClick={() => handleEditStudent(student._id)}>Rediģēt</button>
                                        <button className="student-button" onClick={() => handleDeleteStudent(student._id)}>Izdzēst</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {!groupId && (
                    <div className="addbuttoncard">
                        <button className="student-button" onClick={handleAddStudent}>Pievienot studentu</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;