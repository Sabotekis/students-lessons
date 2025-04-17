import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './students.css';

const EditStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState({ name: "", surname: "", personalCode: "", phoneNumber: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(response => response.json())
            .then(data => setStudent(data))
            .catch(error => console.error("Error fetching students:", error));
    }, [id]);

    const handleUpdateStudent = () => {
        const personalCodeRegex = /^\d{6}-?\d{5}$/;
        if (!student.name || !student.surname || !student.personalCode || !student.phoneNumber || !student.email) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (!personalCodeRegex.test(student.personalCode)) {
            alert("Personas kodam jābūt pareizā formātā");
            return;
        }
        if (student.phoneNumber.length !== 8) {
            alert("Tālruņa numuram jābūt 8 ciparu garam");
            return;
        }
        if (!student.email.includes("@")) {
            alert("E-pastam jābūt pareizā formātā");
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
        .catch(error => console.error('Error updating student:', error));
    };

    const handleBack = () => {
        navigate("/view-student/" + id);
    };

    return (
        <div className="edit-student-container">
            <h1 className="edit-student-title">Studentu rediģēšana</h1>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Vārds"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Uzvārds"
                    value={student.surname}
                    onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Personas kods"
                    value={student.personalCode}
                    onChange={(e) => setStudent({ ...student, personalCode: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="Tālruņa numurs"
                    value={student.phoneNumber}
                    onChange={(e) => setStudent({ ...student, phoneNumber: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-student-input"
                    type="text"
                    placeholder="E-pasts"
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    required
                />
            </div>
            <button className="edit-student-button" onClick={handleUpdateStudent}>Atjaunināt studentu</button>
            <button className="edit-student-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default EditStudent;