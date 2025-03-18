import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Input = styled.input`
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 10%;
    margin-right: 5px;
`;

const Select = styled.select`
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 10%;
`;

const StudentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

const BackButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    margin-left: 5px;

    &:hover {
        background-color: #45a049;
    }
`;

const StudentManagement = ({ isLoggedIn }) => {
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state?.groupId;

    useEffect(() => {
        fetch("/api/students")
            .then(response => response.json())
            .then(data => setStudents(data));

        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data));

        if (groupId) {
            fetch(`/api/groups/${groupId}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));
        }
    }, [groupId]);

    const handleAddStudent = () => {
        navigate("/add-student");
    };

    const handleEditStudent = (id) => {
        navigate(`/edit-student/${id}`);
    };

    const handleDeleteStudent = (id) => {
        fetch(`/api/students/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setStudents(students.filter(student => student._id !== id));
        });
    };

    const handleViewStudent = (id) => {
        navigate(`/view-student/${id}`);
    };

    const handleAddStudentToGroup = (studentId) => {
        fetch(`/api/groups/${groupId}/add-student`, {
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
            fetch("/api/students")
                .then(response => response.json())
                .then(data => setStudents(data));

            fetch(`/api/groups/${groupId}`)
                .then(response => response.json())
                .then(data => setGroupStudents(data.students));

            navigate(`/view-group/${groupId}`);
        })
        .catch(error => {
            console.error('Error adding student to group:', error);
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    const filteredStudents = students
        .filter(student => {
            if (filterBy === "group") {
                return student.groups?.some(groupId => {
                    const group = groups.find(g => g._id === groupId);
                    return group?.title?.toLowerCase().includes(searchTerm.toLowerCase());
                });
            } else {
                const value = student[filterBy]?.toLowerCase() || "";
                return value.includes(searchTerm.toLowerCase());
            }
        })
        .filter(student => !groupStudents.some(groupStudent => groupStudent._id === student._id))
        .sort((a, b) => {
            const valueA = (a[filterBy]?.toLowerCase() || "");
            const valueB = (b[filterBy]?.toLowerCase() || "");
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });

    return (
        <Container>
            <Title>Studentu pārvaldība</Title>
            <div>
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="surname">Surname</option>
                    <option value="personal_code">Personal Code</option>
                    <option value="group">Group</option>
                </Select>
                { groupId && <BackButton onClick={handleBack}>
                    Back
                </BackButton>}
            </div>
            <StudentGrid>
                {filteredStudents.map(student => (
                    <StudentCard key={student._id}>
                        <div><strong>Name:</strong> {student.name}</div>
                        <div><strong>Surname:</strong> {student.surname}</div>
                        <div><strong>Personal Code:</strong> {student.personal_code}</div>
                        <div>
                        <strong>Groups:</strong>{" "}
                        {student.groups && student.groups.map(group => group.title).join(", ")}
                    </div>
                        {isLoggedIn && (
                            <div>
                                {groupId ? (
                                    <Button onClick={() => handleAddStudentToGroup(student._id)}>Add to Group</Button>
                                ) : (
                                    <>
                                        <Button onClick={() => handleViewStudent(student._id)}>View</Button>
                                        <Button onClick={() => handleEditStudent(student._id)}>Edit</Button>
                                        <Button onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                                    </>
                                )}
                            </div>
                        )}
                    </StudentCard>
                ))}
                {isLoggedIn && !groupId && (
                    <AddButtonCard>
                        <Button onClick={handleAddStudent}>Add Student</Button>
                    </AddButtonCard>
                )}
            </StudentGrid>
        </Container>
    );
};

export default StudentManagement;