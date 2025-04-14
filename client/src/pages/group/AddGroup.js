import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groups.css';

const AddGroup = () => {
    const [newGroup, setNewGroup] = useState({ title: "", start_date: "", end_date: "", professor: "", academic_hours: 0 });
    const [plannedMonths, setPlannedMonths] = useState([]);
    const [plannedData, setPlannedData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (newGroup.start_date && newGroup.end_date) {
            const startDate = new Date(newGroup.start_date);
            const endDate = new Date(newGroup.end_date);
            const months = [];

            while (startDate <= endDate) {
                const year = startDate.getFullYear();
                const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
                months.push(`${year}-${month}`);
                startDate.setMonth(startDate.getMonth() + 1);
            }

            setPlannedMonths(months);
        } else {
            setPlannedMonths([]);
        }
    }, [newGroup.start_date, newGroup.end_date]);

    const handlePlannedChange = (month, field, value) => {
        setPlannedData(prev => ({
            ...prev,
            [month]: {
                ...prev[month],
                [field]: value,
            },
        }));
    };

    const handleAddGroup = () => {
        if (!newGroup.title || !newGroup.start_date || !newGroup.end_date || !newGroup.professor) {
            alert("All fields are required");
            return;
        }
        if (new Date(newGroup.start_date) > new Date(newGroup.end_date)) {
            alert("Start date cannot be after end date");
            return;
        }

        const groupData = { ...newGroup, plannedData };

        fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(groupData)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/group-management");
        });
    };

    const handleBack = () => {
        navigate("/group-management");
    };

    return (
        <div className="add-group-container">
            <h1 className="add-group-title">Add Group</h1>
            <div>
                <input  
                    className="add-group-input"
                    type="text"
                    placeholder="Group title"
                    value={newGroup.title}
                    onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-group-input"
                    type="date"
                    placeholder="Start date"
                    value={newGroup.start_date}
                    onChange={(e) => setNewGroup({ ...newGroup, start_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="add-group-input"
                    type="date"
                    placeholder="End date"
                    value={newGroup.end_date}
                    onChange={(e) => setNewGroup({ ...newGroup, end_date: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="add-group-input"
                    type="text"
                    placeholder="Professor"
                    value={newGroup.professor}
                    onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-group-input"
                    type="number"
                    placeholder="Academic Hours"
                    value={newGroup.academic_hours}
                    onChange={(e) => setNewGroup({ ...newGroup, academic_hours: e.target.value })}
                    required
                />
            </div>
            <h3>Planned Days and Hours</h3>
            {plannedMonths.map(month => (
                <div key={month}>
                    <h4>{month}</h4>
                    <input
                        type="number"
                        placeholder="Planned Days"
                        value={plannedData[month]?.days || ""}
                        onChange={(e) => handlePlannedChange(month, "days", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Planned Hours"
                        value={plannedData[month]?.hours || ""}
                        onChange={(e) => handlePlannedChange(month, "hours", e.target.value)}
                    />
                </div>
            ))}
            <button className="add-group-button" onClick={handleAddGroup}>Add Group</button>
            <button className="add-group-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default AddGroup;