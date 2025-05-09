import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './groups.css';

const ViewGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();

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
            <h1 className="view-group-title">Grupas apskatīšana</h1>
            <div>
                <strong>Grupas reģistra numurs:</strong> {group.registerNumber}
            </div>
            <div>
                <strong>Nosaukums:</strong> {group.title}
            </div>
            <div>
                <strong>Sākuma datums:</strong> {new Date(group.startDate).toLocaleDateString()}
            </div>
            <div>
                <strong>Beigu datums:</strong> {new Date(group.endDate).toLocaleDateString()}
            </div>
            <div>
                <strong>Profesors:</strong> {group.professor}
            </div>
            <div>
                <strong>Akadēmiskās stundas:</strong> {group.academicHours}
            </div>
            <div>
                <strong>Minimālais stundu skaits:</strong> {group.minHours}
            </div>
            <div>
                <strong>Plānotas dienas un stundas:</strong>
                <div className="view-group-planned-data">
                    {Object.entries(group.plannedData).map(([month, data]) => (
                        <div key={month}>
                            <strong>{month}:</strong> {data.days} dienas, {data.hours} stundas
                        </div>
                     ))}
                </div>
            </div>
            <div>
                {group.students.length === 0 ? (
                    <div></div>
                ) : (
                    <div>
                        <strong>Studenti:</strong>
                        <div className="view-group-student-grid">
                            {group.students.map(student => (
                                <div className="view-group-student-card" key={student._id}>
                                    <div><strong>Vārds:</strong> {student.name}</div>
                                    <div><strong>Uzvārds:</strong> {student.surname}</div>
                                    <div><strong>Personas kods:</strong> {student.personalCode}</div>
                                    <div><strong>Telefona numurs:</strong> {student.phoneNumber}</div>
                                    <div><strong>E-pasts:</strong> {student.email}</div>
                                    {hasPermission('groups.deleteStudents') && <button className="view-group-delete-button" onClick={() => handleDeleteStudentFromGroup(student._id)}>Nodzēst</button>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {hasPermission('groups.update') && <button className="view-group-button" onClick={handleEditGroup}>Rediģēt</button>}
            {hasPermission('groups.delete') && <button className="view-group-button" onClick={handleDeleteGroup}>Izdzēst</button>}
            <button className="view-group-button" onClick={handleBack}>Atgriezties</button>
            {hasPermission('groups.addStudents') && <button className="view-group-button" onClick={() => handleAddStudentToGroup(group._id)}>Pievienot studentu</button>}
        </div>
    );
};

export default ViewGroup;