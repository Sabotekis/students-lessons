import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const EditStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState({ name: "", surname: "", personal_code: ""});
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
                console.error('Error fetching student:', error);
                setError('Error fetching student');
            });
    }, [id]);

    const handleUpdateStudent = () => {
        if (!student.name || !student.surname || !student.personal_code) {
            alert("All fields are required");
            return;
        }
        fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/student-management");
        })
        .catch(error => {
            console.error('Error updating student:', error);
            setError('Error updating student');
        });
    };

    return (
        <Container>
            <Title>Edit Student</Title>
            {error && <div className="error">{error}</div>}
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
            <Button onClick={handleUpdateStudent}>Update Student</Button>
        </Container>
    );
};

export default EditStudent;