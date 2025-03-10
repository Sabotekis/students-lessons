import React, { useState, useEffect } from "react";
import './MainContainer.css';

const StudentuParvaldiba = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch students from the server
        fetch("/api/students")
            .then(response => response.json())
            .then(data => setStudents(data));
    }, []);

    const handleAddStudent = (student) => {
        // Add student to the server
        fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(newStudent => setStudents([...students, newStudent]));
    };

    const handleEditStudent = (id, updatedStudent) => {
        // Edit student on the server
        fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedStudent)
        })
        .then(response => response.json())
        .then(() => {
            setStudents(students.map(student => student.id === id ? updatedStudent : student));
        });
    };

    const handleDeleteStudent = (id) => {
        // Delete student from the server
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setStudents(students.filter(student => student.id !== id));
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="main-container">
            <h1>Studentu Pārvaldība</h1>
            <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => handleAddStudent({ name: "New Student" })}>Add Student</button>
            <ul>
                {filteredStudents.map(student => (
                    <li key={student.id}>
                        {student.name}
                        <button onClick={() => handleEditStudent(student.id, { ...student, name: "Updated Name" })}>Edit</button>
                        <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentuParvaldiba;
