import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './students.css';
import { useTranslation } from 'react-i18next';

const ViewStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(response => response.json())
            .then(data => setStudent(data))
            .catch(error => console.error('Error fetching group:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission); 

    const handleEditStudent = () => {
        navigate(`/edit-student/${id}`);
    };

    const handleDeleteStudent = () => {
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            navigate("/student-management");
        })
        .catch(error => console.error('Error deleting group:', error));
    };

    const handleBack = () => {
        navigate("/student-management");
    };

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className="view-student-container">
            <h1 className="view-student-title">{t("view_student_title")}</h1>
            <div>
                <strong>{t("student_name")}:</strong> {student.name}
            </div>
            <div>
                <strong>{t("student_surname")}:</strong> {student.surname}
            </div>
            <div>
                <strong>{t("student_personal_code")}:</strong> {student.personalCode}
            </div>
            <div>
                <strong>{t("student_phone_number")}:</strong> {student.phoneNumber}
            </div>
            <div>
                <strong>{t("student_email")}:</strong> {student.email}
            </div>
            <div>
                <strong>{t("student_academic_hours")}:</strong> {student.totalAcademicHours}
            </div>
            <div>
                {student.groups.length === 0 ? (
                    <div></div>
                ) : (
                    <div>
                        <strong>{t("groups")}:</strong>
                        <div className="view-student-group-grid">
                            {student.groups.map((group) => (
                                <div className="view-student-group-card" key={group._id}>
                                    <div><strong>{t("group_name")}:</strong> {group.title}</div>
                                    <div><strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString()}</div>
                                    <div><strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString()}</div>
                                    <div><strong>{t("group_professor")}:</strong> {group.professor}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {hasPermission('students.update') && <button className="view-student-button" onClick={handleEditStudent}>{t("edit")}</button>}
            {hasPermission('students.delete') && <button className="view-student-button" onClick={handleDeleteStudent}>{t("delete")}</button>}
            <button className="view-student-button" onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default ViewStudent;