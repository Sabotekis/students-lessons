import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import './MainContainer.css';

const Container = styled.div`
    margin-top: 80px;
    padding: 20px;
    text-align: center;
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

const Input = styled.input`
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 20%;
`;

const AddGroup = () => {
    const [newGroup, setNewGroup] = useState({ title: "", start_date: "", end_date: "", professor: "" });
    const navigate = useNavigate();

    const handleAddGroup = () => {
        if (!newGroup.title || !newGroup.start_date || !newGroup.end_date || !newGroup.professor) {
            alert("All fields are required");
            return;
        }
        if (new Date(newGroup.start_date) > new Date(newGroup.end_date)) {
            alert("Start date cannot be after end date");
            return;
        }
        fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGroup)
        })
        .then(response => response.json())
        .then(newGroup => {
            navigate("/group-management");
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    return (
        <Container>
            <Title>Add Group</Title>
            <div>
                <Input
                    type="text"
                    placeholder="Group title"
                    value={newGroup.title}
                    onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="date"
                    placeholder="Start date"
                    value={newGroup.start_date}
                    onChange={(e) => setNewGroup({ ...newGroup, start_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="date"
                    placeholder="End date"
                    value={newGroup.end_date}
                    onChange={(e) => setNewGroup({ ...newGroup, end_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="text"
                    placeholder="Professor"
                    value={newGroup.professor}
                    onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
                    required
                />
            </div>
            <Button onClick={handleAddGroup}>Add Group</Button>
            <Button onClick={handleBack}>Back</Button>
        </Container>
    );
};

export default AddGroup;