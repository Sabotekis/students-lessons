import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './students.css';

const StudentManagement = ({ isLoggedIn }) => {
    const [students, setStudents] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state?.groupId;

    useEffect(() => {
        fetch("/api/students")
            .then(response => response.json())
            .then(data => setStudents(data));

        if (groupId) {
            fetch(`/api/groups/${groupId}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));
        }
    }, [groupId]);

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
                    className="search-input"
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="search-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="surname">Surname</option>
                    <option value="personal_code">Personal Code</option>
                </select>
                { groupId && <button className="backbutton" onClick={handleBack}>
                    Back
                </button>}
            </div>
            <div className="student-grid">
                {groupId && filteredStudents.length === 0 ? (
                    <div className="no-students-message">No students available</div>
                ) : (
                    filteredStudents.map(student => (
                        <div className="student-card" key={student._id}>
                            <div><strong>Name:</strong> {student.name}</div>
                            <div><strong>Surname:</strong> {student.surname}</div>
                            <div><strong>Personal Code:</strong> {student.personal_code}</div>
                            <div>
                                {groupId ? (
                                    isLoggedIn && (
                                        <button className="button" onClick={() => handleAddStudentToGroup(student._id)}>Add to Group</button>
                                    )
                                ) : (
                                    <>
                                        <button className="button" onClick={() => handleViewStudent(student._id)}>View</button>
                                        {isLoggedIn && <button className="button" onClick={() => handleEditStudent(student._id)}>Edit</button>}
                                        {isLoggedIn && <button className="button" onClick={() => handleDeleteStudent(student._id)}>Delete</button>}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoggedIn && !groupId && (
                    <div className="addbuttoncard">
                        <button className="button" onClick={handleAddStudent}>Add Student</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;