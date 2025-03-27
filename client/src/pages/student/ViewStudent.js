import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './students.css';

const ViewStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
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
                console.error('Error fetching group:', error);
                setError('Error fetching group');
            });
    }, [id]);

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
        .catch(error => {
            console.error('Error deleting group:', error);
            setError('Error deleting group');
        });
    };

    const handleBack = () => {
        navigate("/student-management");
    };

    if (error) {
        return <div className="view-student-container"><div className="error">{error}</div></div>;
    }

    if (!student) {
        return <div className="view-student-container"><div>Loading...</div></div>;
    }

    return (
        <div className="view-student-container">
            <h1 className="view-student-title">View Student</h1>
            <div>
                <strong>Name:</strong> {student.name}
            </div>
            <div>
                <strong>Surname:</strong> {student.surname}
            </div>
            <div>
                <strong>Personal code:</strong> {student.personal_code}
            </div>
            <div>
                <strong>Groups:</strong>
                {student.groups.length === 0 && <div>No groups</div>}
                <div className="view-student-group-grid">
                    {student.groups.map((group) => (
                        <div className="view-student-group-card" key={group._id}>
                            <div><strong>Title:</strong> {group.title}</div>
                            <div><strong>Start date:</strong> {new Date(group.start_date).toLocaleDateString()}</div>
                            <div><strong>End Date:</strong> {new Date(group.end_date).toLocaleDateString()}</div>
                            <div><strong>Professor:</strong> {group.professor}</div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="view-student-button" onClick={handleEditStudent}>Edit</button>
            <button className="view-student-button" onClick={handleDeleteStudent}>Delete</button>
            <button className="view-student-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default ViewStudent;