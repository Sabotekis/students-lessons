import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './sessions.css';

const ViewSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        fetch(`/api/sessions/${id}`)
            .then(response => response.json())
            .then(data => setSession(data))
            .catch(error => console.error('Error fetching session:', error));
        fetch('/api/roles/permissions')
            .then(res => res.json())
            .then(data => setUserPermissions(data));
    }, [id]);

    const hasPermission = (permission) => userPermissions.includes(permission);

    const handleBack = () => {
        navigate("/session-management");
    };

    if (!session) {
        return <div className="view-session-container"><div>Loading...</div></div>;
    }

    return (
        <div className="view-session-container">
            <h1 className="view-session-title">Apmācību sesijas apskatīšana</h1>
            <div>
                <strong>Datums:</strong> {new Date(session.startDateTime).toLocaleString()} - {new Date(session.endDateTime).toLocaleString()}
            </div>
            <div>
                <strong>Grupa:</strong>
                <div className="view-session-group-grid">
                    <div className="view-session-group-card">
                        <div><strong>Grupas reģistra numurs</strong> {session.group.registerNumber}</div>
                        <div><strong>Nosaukums:</strong> {session.group.title}</div>
                        <div><strong>Sākuma datums:</strong> {new Date(session.group.startDate).toLocaleDateString()}</div>
                        <div><strong>Beigu datums:</strong> {new Date(session.group.endDate).toLocaleDateString()}</div>
                        <div><strong>Profesors:</strong> {session.group.professor}</div>
                        <div><strong>Akadēmiskās stundas:</strong> {session.group.academicHours}</div>
                        <div><strong>Minimālais stundu skaits:</strong> {session.group.minHours}</div>
                        <div>
                            <strong>Plānotas dienas un stundas:</strong>
                            <div className="view-group-planned-data">
                                {Object.entries(session.group.plannedData).map(([month, data]) => (
                                    <div key={month}>
                                        <strong>{month}:</strong> {data.days} dienas, {data.hours} stundas
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {session.students.length === 0 ? ( 
                    <div></div>
                ) : (
                    <div>
                        <strong>Studenti:</strong>
                        <div className="view-session-student-grid">
                            {session.students.map(student => {
                                const hasAttendance = session.attendances.some(attendance => 
                                    attendance.student && attendance.student._id === student._id
                                );

                                return (
                                    <div
                                        className={`view-session-student-card ${hasAttendance ? 'attended' : 'not-attended'}`}
                                        key={student._id}
                                    >
                                        <div><strong>Vārds:</strong> {student.name}</div>
                                        <div><strong>Uzvārds:</strong> {student.surname}</div>
                                        <div><strong>Personas kods:</strong> {student.personalCode}</div>
                                        <div><strong>Telefona numurs:</strong> {student.phoneNumber}</div>
                                        <div><strong>E-pasts</strong> {student.email}</div>
                                        {student.deleted && (
                                            <div>(Šis students ir dzēsts)</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {!session.finished && (
                <>
                    {hasPermission('sessions.update') && <button className="view-session-button" onClick={() => navigate(`/edit-session/${id}`)}>Rediģēt</button>}
                    {hasPermission('sessions.delete') && <button className="view-session-button" onClick={() => {
                        fetch(`/api/sessions/${id}`, { method: "DELETE" })
                            .then(() => navigate("/session-management"));
                    }}>Izdzēst</button>}
                </>
            )}
            <button className="view-session-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default ViewSession;