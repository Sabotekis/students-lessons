import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './students.css';

const AddStudent = () => {
    const [student, setStudent] = useState({ name: "", surname: "", personal_code: "" });
    const navigate = useNavigate();

    const handleAddStudent = () => {
    const personalCodeRegex = /^\d{6}-?\d{5}$/;
    if (!student.name || !student.surname || !student.personal_code) {
        alert("All fields are required");
        return;
    }
    if (!personalCodeRegex.test(student.personal_code)) {
        alert("Personal code must be in the proper format");
        return;
    }
    fetch("/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    })
    .then(response => response.json())
    .then(() => {
        navigate("/student-management");
    });
};

    const handleBack = () => {
        navigate("/student-management");
    };

    return (
        <div className="add-student-container">
            <h1 className="add-student-title">Add Student</h1>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="Name"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="Surname"
                    value={student.surname}
                    onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="e.g. 123456-12345"
                    value={student.personal_code}
                    onChange={(e) => setStudent({ ...student, personal_code: e.target.value })}
                    required
                />
            </div>
            <button className="add-student-button" onClick={handleAddStudent}>Add Student</button>
            <button className="add-student-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default AddStudent;