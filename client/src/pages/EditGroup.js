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

const EditGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({ title: "", start_date: "", end_date: "", professor: "" });
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
            .then(data => setGroup({
                ...data,
                start_date: data.start_date.slice(0, 10),
                end_date: data.end_date.slice(0, 10)
            }))
            .catch(error => {
                console.error('Error fetching group:', error);
                setError('Error fetching group');
            });
    }, [id]);

    const handleUpdateGroup = () => {
        if (!group.title || !group.start_date || !group.end_date || !group.professor) {
            alert("All fields are required");
            return;
        }
        if (new Date(group.start_date) > new Date(group.end_date)) {
            alert("Start date cannot be after end date");
            return;
        }
        fetch(`/api/groups/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(group)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/view-group/" + id);
        })
        .catch(error => {
            console.error('Error updating group:', error);
            setError('Error updating group');
        });
    };

    return (
        <Container>
            <Title>Edit Group</Title>
            {error && <div className="error">{error}</div>}
            <div>
                <Input
                    type="text"
                    placeholder="Group title"
                    value={group.title}
                    onChange={(e) => setGroup({ ...group, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="date"
                    placeholder="Start date"
                    value={group.start_date}
                    onChange={(e) => setGroup({ ...group, start_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="date"
                    placeholder="End date"
                    value={group.end_date}
                    onChange={(e) => setGroup({ ...group, end_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="text"
                    placeholder="Professor"
                    value={group.professor}
                    onChange={(e) => setGroup({ ...group, professor: e.target.value })}
                    required
                />
            </div>
            <Button onClick={handleUpdateGroup}>Update Group</Button>
        </Container>
    );
};

export default EditGroup;