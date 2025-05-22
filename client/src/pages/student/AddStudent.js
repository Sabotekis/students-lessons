import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './students.css';
import { useTranslation } from "react-i18next";

const AddStudent = () => {
    const { t } = useTranslation();
    const [student, setStudent] = useState({ name: "", surname: "", personalCode: "", phoneNumber: "", email: "" });
    const navigate = useNavigate();

    const handleAddStudent = () => {
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
            <h1 className="add-student-title">{t("add_student")}</h1>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder={t("name")}
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder={t("surname")}
                    value={student.surname}
                    onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="Personas kods"
                    value={student.personalCode}
                    onChange={(e) => setStudent({ ...student, personalCode: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="Tālruņa numurs"
                    value={student.phoneNumber}
                    onChange={(e) => setStudent({ ...student, phoneNumber: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-student-input"
                    type="text"
                    placeholder="E-pasts"
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    required
                />
            </div>
            <button className="add-student-button" onClick={handleAddStudent}>{t("add_student")}</button>
            <button className="add-student-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default AddStudent;