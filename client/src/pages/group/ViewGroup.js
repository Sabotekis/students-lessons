import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './groups.css';
import { useTranslation } from 'react-i18next';

const ViewGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`/api/groups/${id}`)
            .then(response => response.json())
            .then(data => setGroup(data))
            .catch(error => console.error('Error fetching group:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleEditGroup = () => {
        navigate(`/edit-group/${id}`);
    };

    const handleDeleteGroup = () => {
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                navigate("/group-management");
            })
            .catch(error => console.error('Error deleting group:', error));
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    const handleAddStudentToGroup = (groupId) => {
        navigate("/student-management", { state: { groupId } });
    };

    const handleDeleteStudentFromGroup = (studentId) => {
        fetch(`/api/groups/${id}/remove-student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId })
        })
            .then(response => response.json())
            .then(() => {
                setGroup({
                    ...group,
                    students: group.students.filter(student => student._id !== studentId)
                });
            })
            .catch(error => console.error('Error removing student from group:', error));
    };

    if (!group) {
        return <div className="view-group-container"><div>Loading...</div></div>;
    }

    return (
        <div className="view-group-container">
            <h1 className="view-group-title">{t("view_group_title")}</h1>
            <div>
                <strong>{t("group_register_number")}:</strong> {group.registerNumber}
            </div>
            <div>
                <strong>{t("group_name")}:</strong> {group.title}
            </div>
            <div>
                <strong>{t("group_start_date")}:</strong> {new Date(group.startDate).toLocaleDateString()}
            </div>
            <div>
                <strong>{t("group_end_date")}:</strong> {new Date(group.endDate).toLocaleDateString()}
            </div>
            <div>
                <strong>{t("group_professor")}:</strong> {group.professor}
            </div>
            <div>
                <strong>{t("group_academic_hours")}:</strong> {group.academicHours}
            </div>
            <div>
                <strong>{t("group_min_hours")}:</strong> {group.minHours}
            </div>
            <div>
                <strong>{t("group_planned_data")}:</strong>
                <div className="view-group-planned-data">
                    {Object.entries(group.plannedData).map(([month, data]) => (
                        <div key={month}>
                            <strong>{month}:</strong> {data.days} {t("days")}, {data.hours} {t("hours")}
                        </div>
                     ))}
                </div>
            </div>
            <div>
                {group.students.length === 0 ? (
                    <div></div>
                ) : (
                    <div>
                        <strong>{t("students")}:</strong>
                        <div className="view-group-student-grid">
                            {group.students.map(student => (
                                <div className="view-group-student-card" key={student._id}>
                                    <div><strong>{t("student_name")}:</strong> {student.name}</div>
                                    <div><strong>{t("student_surname")}:</strong> {student.surname}</div>
                                    <div><strong>{t("student_personal_code")}:</strong> {student.personalCode}</div>
                                    <div><strong>{t("student_phone_number")}:</strong> {student.phoneNumber}</div>
                                    <div><strong>{t("student_email")}:</strong> {student.email}</div>
                                    {hasPermission('groups.deleteStudents') && <button className="view-group-delete-button" onClick={() => handleDeleteStudentFromGroup(student._id)}>{t("remove")}</button>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {hasPermission('groups.update') && <button className="view-group-button" onClick={handleEditGroup}>{t("edit")}</button>}
            {hasPermission('groups.delete') && <button className="view-group-button" onClick={handleDeleteGroup}>{t("delete")}</button>}
            <button className="view-group-button" onClick={handleBack}>{t("back")}</button>
            {hasPermission('groups.addStudents') && <button className="view-group-button" onClick={() => handleAddStudentToGroup(group._id)}>{t("student_add")}</button>}
        </div>
    );
};

export default ViewGroup;