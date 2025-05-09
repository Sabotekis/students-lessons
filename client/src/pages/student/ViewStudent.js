import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './students.css';

const ViewStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();

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
            <h1 className="view-student-title">Studentu apskatīšana</h1>
            <div>
                <strong>Vārds:</strong> {student.name}
            </div>
            <div>
                <strong>Uzvārds:</strong> {student.surname}
            </div>
            <div>
                <strong>Personas kods:</strong> {student.personalCode}
            </div>
            <div>
                <strong>Tālruņa numurs:</strong> {student.phoneNumber}
            </div>
            <div>
                <strong>E-pasts:</strong> {student.email}
            </div>
            <div>
                <strong>Akadēmiskās stundas: {student.totalAcademicHours}</strong>
            </div>
            <div>
                {student.groups.length === 0 ? (
                    <div></div>
                ) : (
                    <div>
                        <strong>Grupas:</strong>
                        <div className="view-student-group-grid">
                            {student.groups.map((group) => (
                                <div className="view-student-group-card" key={group._id}>
                                    <div><strong>Nosaukums:</strong> {group.title}</div>
                                    <div><strong>Sākuma datums:</strong> {new Date(group.startDate).toLocaleDateString()}</div>
                                    <div><strong>Beigu datums:</strong> {new Date(group.endDate).toLocaleDateString()}</div>
                                    <div><strong>Profesors:</strong> {group.professor}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {hasPermission('students.update') && <button className="view-student-button" onClick={handleEditStudent}>Rediģēt</button>}
            {hasPermission('students.delete') && <button className="view-student-button" onClick={handleDeleteStudent}>Izdzēst</button>}
            <button className="view-student-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default ViewStudent;