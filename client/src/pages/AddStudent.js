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

const AddStudent = () => {
    const [student, setStudent] = useState({ name: "", surname: "", personal_code: "" });
    const navigate = useNavigate();

    const handleAddStudent = () => {
        if (!student.name || !student.surname || !student.personal_code) {
            alert("All fields are required");
            return;
        }
        fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/student-management");
        });
    };

    const handleBack = () => {
        navigate("/student-management");
    };

    return (
        <Container>
            <Title>Add Student</Title>
            <div>
                <Input
                    type="text"
                    placeholder="Name"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="text"
                    placeholder="Surname"
                    value={student.surname}
                    onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="text"
                    placeholder="Personal Code"
                    value={student.personal_code}
                    onChange={(e) => setStudent({ ...student, personal_code: e.target.value })}
                    required
                />
            </div>
            <Button onClick={handleAddStudent}>Add Student</Button>
            <Button onClick={handleBack}>Back</Button>
        </Container>
    );
};

export default AddStudent;