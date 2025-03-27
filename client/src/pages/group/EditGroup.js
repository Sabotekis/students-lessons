import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './groups.css';

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

    const Backbutton = () => {
        navigate("/view-group/" + id);
    };

    return (
        <div className="edit-group-container">
            <h1 className="edit-group-title">Edit Group</h1>
            {error && <div className="error">{error}</div>}
            <div>
                <input
                    className="edit-group-input"
                    type="text"
                    placeholder="Group title"
                    value={group.title}
                    onChange={(e) => setGroup({ ...group, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-group-input"
                    type="date"
                    placeholder="Start date"
                    value={group.start_date}
                    onChange={(e) => setGroup({ ...group, start_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-group-input"
                    type="date"
                    placeholder="End date"
                    value={group.end_date}
                    onChange={(e) => setGroup({ ...group, end_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-group-input"
                    type="text"
                    placeholder="Professor"
                    value={group.professor}
                    onChange={(e) => setGroup({ ...group, professor: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-group-input"
                    type="number"
                    placeholder="Academic Hours"
                    value={group.academic_hours}
                    onChange={(e) => setGroup({ ...group, academic_hours: e.target.value })}
                    required
                />
            </div>
            <button className="edit-group-button" onClick={handleUpdateGroup}>Update Group</button>
            <button className="edit-group-button" onClick={Backbutton}>Back</button>
        </div>
    );
};

export default EditGroup;