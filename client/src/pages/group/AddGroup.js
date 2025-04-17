import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './groups.css';

const AddGroup = () => {
    const [newGroup, setNewGroup] = useState({ registerNumber: "", title: "", startDate: "", endDate: "", professor: "", academicHours: 0, minHours: 0 });
    const [plannedMonths, setPlannedMonths] = useState([]);
    const [plannedData, setPlannedData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (newGroup.startDate && newGroup.endDate) {
            const startDate = new Date(newGroup.startDate);
            const endDate = new Date(newGroup.endDate);
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
    }, [newGroup.startDate, newGroup.endDate]);

    const handlePlannedChange = (month, field, value) => {
        setPlannedData(prev => {
            const updatedPlannedData = {
                ...prev,
                [month]: {
                    ...prev[month],
                    [field]: value,
                },
            };
    
            const totalPlannedHours = Object.values(updatedPlannedData).reduce((sum, monthData) => {
                return sum + (parseInt(monthData.hours, 10) || 0);
            }, 0);
    
            setNewGroup(prevGroup => ({
                ...prevGroup,
                academicHours: totalPlannedHours,
            }));
    
            return updatedPlannedData;
        });
    };


    const handleAddGroup = () => {
        if (!newGroup.registerNumber || !newGroup.title || !newGroup.startDate || !newGroup.endDate || !newGroup.professor || !newGroup.minHours) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(newGroup.startDate) > new Date(newGroup.endDate)) {
            alert("Sākuma datums nedrīkst būt pēc beigu datuma");
            return;
        }
        if (newGroup.academicHours <= 0) {
            alert("Akadēmisko stundu skaitam jābūt lielākam par 0");
            return;
        }
        if (newGroup.minHours > newGroup.academicHours) {
            alert("Minimālais stundu skaits nevar būt lielāks par akadēmiskajām stundām");
            return;
        }
        if (newGroup.minHours < 0) {
            alert("Minimālais stundu skaits nevar būt negatīvs");
            return;
        }
        if (Object.keys(plannedData).length === 0) {
            alert("Nepieciešams vismaz viens plānotais mēnesis");
            return;
        }
        if (Object.values(plannedData).some(data => !data.days || !data.hours)) {
            alert("Jāaizpilda visas plānotās dienas un stundas");
            return;
        }
        if (Object.values(plannedData).some(data => data.hours < 0 || data.days < 0)) {
            alert("Plānotās dienas un stundas nevar būt negatīvas");
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
            <h1 className="add-group-title">Grupu pievienošana</h1>
            <div>
                <input
                    className="add-group-input"
                    type="text"
                    placeholder="Grupas reģistra numurs"
                    value={newGroup.registerNumber}
                    onChange={(e) => setNewGroup({ ...newGroup, registerNumber: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="add-group-input"
                    type="text"
                    placeholder="Nosaukums"
                    value={newGroup.title}
                    onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="add-group-input"
                    type="date"
                    placeholder="Sākuma datums"
                    value={newGroup.startDate}
                    onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="add-group-input"
                    type="date"
                    placeholder="Beigu datums"
                    value={newGroup.endDate}
                    onChange={(e) => setNewGroup({ ...newGroup, endDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="add-group-input"
                    type="text"
                    placeholder="Profesors"
                    value={newGroup.professor}
                    onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
                    required
                />
            </div>
            <div>
                <strong>Akadēmiskās stundas: {newGroup.academicHours} </strong>
            </div>
            <div>
                Minimālais stundu skaits:
                <input
                    className="add-group-input"
                    type="number"
                    placeholder="Minimālais stundu skaits"
                    value={newGroup.minHours}
                    onChange={(e) => setNewGroup({ ...newGroup, minHours: e.target.value })}
                    required
                />
            </div>
            <h3>Plānotie mēneši</h3>
            {plannedMonths.map(month => (
                <div key={month}>
                    <h4>{month}</h4>
                    <div>
                        Plānotas dienas:
                        <input
                            className="add-group-input"
                            type="number"
                            placeholder="Plānotas dienas"
                            value={plannedData[month]?.days || ""}
                            onChange={(e) => handlePlannedChange(month, "days", e.target.value)}
                        />
                    </div>
                    <div>
                        Plānotas stundas:
                        <input
                            className="add-group-input"
                            type="number"
                            placeholder="Plānotas stundas"
                            value={plannedData[month]?.hours || ""}
                            onChange={(e) => handlePlannedChange(month, "hours", e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <button className="add-group-button" onClick={handleAddGroup}>Pievienot grupu</button>
            <button className="add-group-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default AddGroup;