import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './students.css';
import { useTranslation } from 'react-i18next';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state?.groupId;
    const [userPermissions, setUserPermissions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/students", {credentials: "include"})
            .then(response => response.json())
            .then(data => setStudents(data));

        if (groupId) {
            fetch(`/api/groups/${groupId}`, {credentials: "include"})
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));
        }
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [groupId, navigate]);

    const hasPermission = (permission) => userPermissions.includes(permission);
    
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
            <h1 className="student-title">{t("student_title")}</h1>
            <div>
                <input 
                    className="student-search-input"
                    type="text"
                    placeholder={t("student_search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="student-search-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="name">{t("student_name")}</option>
                    <option value="surname">{t("student_surname")}</option>
                    <option value="personalCode">{t("student_personal_code")}</option>
                    <option value="phoneNumber">{t("student_phone_number")}</option>
                    <option value="email">{t("student_email")}</option>
                </select>
                { groupId && <button className="backbutton" onClick={handleBack}>
                    {t("back")}
                </button>}
            </div>
            <div className="student-grid">
                {groupId && filteredStudents.length === 0 ? (
                    <div>{t("student_none")}</div>
                ) : (
                    filteredStudents.map(student => (
                        <div className="student-card" key={student._id}>
                            <div><strong>{t("student_name")}:</strong> {student.name}</div>
                            <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                            <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                            <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                            <div><strong>{t("student_email")}:</strong> {student.email}</div>
                            <div><strong>{t("student_academic_hours")}: {student.totalAcademicHours}</strong></div>
                            <div>
                                {groupId ? (
                                    <button className="student-button" onClick={() => handleAddStudentToGroup(student._id)}>{t("student_add")}</button>
                                ) : (
                                    <>
                                        <button className="student-button" onClick={() => handleViewStudent(student._id)}>{t("view")}</button>
                                        {hasPermission('students.update') && <button className="student-button" onClick={() => handleEditStudent(student._id)}>{t("edit")}</button>}
                                        {hasPermission('students.delete') && <button className="student-button" onClick={() => handleDeleteStudent(student._id)}>{t("delete")}</button>}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {!groupId && hasPermission('students.create') && ( 
                    <div className="addbuttoncard">
                        <button className="student-button" onClick={handleAddStudent}>{t("student_add")}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;