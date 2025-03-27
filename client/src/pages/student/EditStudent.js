import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './students.css';

const EditStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState({ name: "", surname: "", personal_code: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setStudent(data))
            .catch(error => {
                console.error('Error fetching student:', error);
                setError('Error fetching student');
            });
    }, [id]);

    const handleUpdateStudent = () => {
        const personalCodeRegex = /^\d{6}-?\d{5}$/;
        if (!student.name || !student.surname || !student.personal_code) {
            alert("All fields are required");
            return;
        }
        if (!personalCodeRegex.test(student.personal_code)) {
            alert("Personal code must be in the proper format");
            return;
        }
        fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/student-management");
        })
        .catch(error => {
            console.error('Error updating student:', error);
            setError('Error updating student');
        });
    };

    const Backbutton = () => {
        navigate("/view-student/" + id);
    };

    return (
        <div className="edit-student-container">
            <h1 className="edit-student-title">Edit Student</h1>
            {error && <div className="error">{error}</div>}
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Name"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Surname"
                    value={student.surname}
                    onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="e.g. 123456-12345"
                    value={student.personal_code}
                    onChange={(e) => setStudent({ ...student, personal_code: e.target.value })}
                    required
                />
            </div>
            <button className="edit-student-button" onClick={handleUpdateStudent}>Update Student</button>
            <button className="edit-student-button" onClick={Backbutton}>Back</button>
        </div>
    );
};

export default EditStudent;