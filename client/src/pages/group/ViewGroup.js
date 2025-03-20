import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './groups.css';

const ViewGroup = ({isLoggedIn}) => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/groups/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setGroup(data))
            .catch(error => {
                console.error('Error fetching group:', error);
                setError('Error fetching group');
            });
    }, [id]);

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
        .catch(error => {
            console.error('Error deleting group:', error);
            setError('Error deleting group');
        });
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            setGroup({
                ...group,
                students: group.students.filter(student => student._id !== studentId)
            });
        })
        .catch(error => {
            console.error('Error removing student from group:', error);
            setError('Error removing student from group');
        });
    };

    if (error) {
        return <div className="view-group-container"><div className="error">{error}</div></div>;
    }

    if (!group) {
        return <div className="view-group-container"><div>Loading...</div></div>;
    }

    return (
        <div className="view-group-container">
            <h1 className="view-group-title">View Group</h1>
            <div>
                <strong>Title:</strong> {group.title}
            </div>
            <div>
                <strong>Start Date:</strong> {new Date(group.start_date).toLocaleDateString()}
            </div>
            <div>
                <strong>End Date:</strong> {new Date(group.end_date).toLocaleDateString()}
            </div>
            <div>
                <strong>Professor:</strong> {group.professor}
            </div>
            <div>
                <strong>Students:</strong>
                <div className="student-grid">
                    {group.students.length === 0 && <div>There is no students added</div>}
                    {group.students.map(student => (
                        <div className="student-card" key={student._id}>
                            <div><strong>Name:</strong> {student.name}</div>
                            <div><strong>Surname:</strong> {student.surname}</div>
                            <div><strong>Personal Code:</strong> {student.personal_code}</div>
                            {isLoggedIn && <button className="view-group-delete-button" onClick={() => handleDeleteStudentFromGroup(student._id)}>Remove</button>}
                        </div>
                    ))}
                </div>
            </div>
            {isLoggedIn && <button className="view-group-button" onClick={handleEditGroup}>Edit</button>}
            {isLoggedIn && <button className="view-group-button" onClick={handleDeleteGroup}>Delete</button>}
            <button className="view-group-button" onClick={handleBack}>Back</button>
            {isLoggedIn && <button className="view-group-button" onClick={() => handleAddStudentToGroup(group._id)}>Add Student</button>}
        </div>
    );
};

export default ViewGroup;