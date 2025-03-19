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

const GroupGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const GroupCard = styled.div`
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
`;

const ViewStudent = ({ isLoggedIn }) => {
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
        return <Container><div className="error">{error}</div></Container>;
    }

    if (!student) {
        return <Container><div>Loading...</div></Container>;
    }

    return (
        <Container>
            <Title>View Student</Title>
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
                <GroupGrid>
                    {student.groups.map((group) => (
                        <GroupCard key={group._id}>
                            <div><strong>Title:</strong> {group.title}</div>
                            <div><strong>Start date:</strong> {new Date(group.start_date).toLocaleDateString()}</div>
                            <div><strong>End Date:</strong> {new Date(group.end_date).toLocaleDateString()}</div>
                            <div><strong>Professor:</strong> {group.professor}</div>
                        </GroupCard>
                    ))}
                </GroupGrid>
            </div>
            {isLoggedIn && <Button onClick={handleEditStudent}>Edit</Button>}
            {isLoggedIn && <Button onClick={handleDeleteStudent}>Delete</Button>}
            <Button onClick={handleBack}>Back</Button>
        </Container>
    );
};

export default ViewStudent;