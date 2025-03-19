import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import './MainContainer.css';

const Container = styled.div`
    margin-top: 80px;
    padding: 20px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 20px;
`;

const Button = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 10px;

    &:hover {
        background-color: #45a049;
    }
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 10px;

    &:hover {
        background-color: #e53935;
    }
`;

const StudentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const StudentCard = styled.div`
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
`;

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
        return <Container><div className="error">{error}</div></Container>;
    }

    if (!group) {
        return <Container><div>Loading...</div></Container>;
    }

    return (
        <Container>
            <Title>View Group</Title>
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
                <StudentGrid>
                    {group.students.map(student => (
                        <StudentCard key={student._id}>
                            <div><strong>Name:</strong> {student.name}</div>
                            <div><strong>Surname:</strong> {student.surname}</div>
                            <div><strong>Personal Code:</strong> {student.personal_code}</div>
                            {isLoggedIn && <DeleteButton onClick={() => handleDeleteStudentFromGroup(student._id)}>Remove</DeleteButton>}
                        </StudentCard>
                    ))}
                </StudentGrid>
            </div>
            {isLoggedIn && <Button onClick={handleEditGroup}>Edit</Button>}
            {isLoggedIn && <Button onClick={handleDeleteGroup}>Delete</Button>}
            <Button onClick={handleBack}>Back</Button>
            {isLoggedIn && <Button onClick={() => handleAddStudentToGroup(group._id)}>Add Student</Button>}
        </Container>
    );
};

export default ViewGroup;