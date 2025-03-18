import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    margin-bottom: 20px;
    margin-left: 5px;
    margin-top: 5px;

    &:hover {
        background-color: #45a049;
    }
`;

const GroupGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
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

const AddButtonCard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border: 1px dashed #ccc;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    cursor: pointer;

    &:hover {
        background-color: #e0e0e0;
    }
`;

const GroupManagement = ({ isLoggedIn }) => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data));
    }, []);

    const handleAddGroup = () => {
        navigate("/add-group");
    };

    const handleEditGroup = (id) => {
        navigate(`/edit-group/${id}`);
    };

    const handleViewGroup = (id) => {
        navigate(`/view-group/${id}`);
    };

    const handleDeleteGroup = (id) => {
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setGroups(groups.filter(group => group._id !== id));
        });
    };

    const handleAddStudentToGroup = (groupId) => {
        navigate("/student-management", { state: { groupId } });
    };

    return (
        <Container>
            <Title>Grupu Parvaldība</Title>
            <GroupGrid>
                {groups.map(group => (
                    <GroupCard key={group._id}>
                        <div><strong>Title:</strong> {group.title}</div>
                        <div><strong>Start Date:</strong> {new Date(group.start_date).toLocaleDateString()}</div>
                        <div><strong>End Date:</strong> {new Date(group.end_date).toLocaleDateString()}</div>
                        <div><strong>Professor:</strong> {group.professor}</div>
                        {isLoggedIn && (    
                            <div>
                                <Button onClick={() => handleViewGroup(group._id)}>View</Button>
                                <Button onClick={() => handleEditGroup(group._id)}>Edit</Button>
                                <Button onClick={() => handleDeleteGroup(group._id)}>Delete</Button>
                                <Button onClick={() => handleAddStudentToGroup(group._id)}>Add Student</Button>
                            </div>
                        )}
                    </GroupCard>
                ))}
                {isLoggedIn && (
                    <AddButtonCard onClick={handleAddGroup}>
                        <Button>Add Group</Button>
                    </AddButtonCard>
                )}
            </GroupGrid>
        </Container>
    );
};

export default GroupManagement;