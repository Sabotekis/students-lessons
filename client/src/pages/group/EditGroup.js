import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './groups.css';

const EditGroup = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({ registerNumber: "", title: "", startDate: "", endDate: "", professor: "", academicHours: 0, minHours: 0});
    const [plannedMonths, setPlannedMonths] = useState([]);
    const [plannedData, setPlannedData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/groups/${id}`)
            .then(response => response.json())
            .then(data => {
                setGroup({
                    ...data,
                    startDate: data.startDate.slice(0, 10),
                    endDate: data.endDate.slice(0, 10),
                });
    
                // Initialize plannedData from the fetched group data
                setPlannedData(data.plannedData || {});
            })
            .catch(error => console.error('Error fetching group:', error));
    
        if (group.startDate && group.endDate) {
            const startDate = new Date(group.startDate);
            const endDate = new Date(group.endDate);
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
    }, [id, group.startDate, group.endDate]);
    
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
    
            setGroup(prevGroup => ({
                ...prevGroup,
                academicHours: totalPlannedHours,
            }));
    
            return updatedPlannedData;
        });
    };

    const handleUpdateGroup = () => {
        if (!group.registerNumber || !group.title || !group.startDate || !group.endDate || !group.professor || !group.minHours) {
            alert("Visi lauki ir obligāti");
            return;
        }
        if (new Date(group.startDate) > new Date(group.endDate)) {
            alert("Sākuma datums nedrīkst būt pēc beigu datuma");
            return;
        }
        if (group.academicHours <= 0) {
            alert("Akadēmisko stundu skaitam jābūt lielākam par 0");
            return;
        }
        if (group.minHours > group.academicHours) {
            alert("Minimālais stundu skaits nevar būt lielāks par akadēmiskajām stundām");
            return;
        }
        if (group.minHours < 0) {
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
        const updatedGroup = { ...group, plannedData };
        fetch(`/api/groups/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedGroup)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/view-group/" + id);
        })
        .catch(error => console.error('Error updating group:', error));
    };

    const handleBack = () => {
        navigate("/view-group/" + id);
    };

    return (
        <div className="edit-group-container">
            <h1 className="edit-group-title">Grupas rediģēšana</h1>
            <div>
                <input
                    className="edit-group-input"
                    type="text"
                    placeholder="Grupas reģistra numurs"
                    value={group.registerNumber}
                    onChange={(e) => setGroup({ ...group, registerNumber: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="edit-group-input"
                    type="text"
                    placeholder="Nosaukums"
                    value={group.title}
                    onChange={(e) => setGroup({ ...group, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <input
                    className="edit-group-input"
                    type="date"
                    placeholder="Sākuma datums"
                    value={group.startDate}
                    onChange={(e) => setGroup({ ...group, startDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="edit-group-input"
                    type="date"
                    placeholder="Beigu datums"
                    value={group.endDate}
                    onChange={(e) => setGroup({ ...group, endDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <input  
                    className="edit-group-input"
                    type="text"
                    placeholder="Profesors"
                    value={group.professor}
                    onChange={(e) => setGroup({ ...group, professor: e.target.value })}
                    required
                />
            </div>
            <div>
                <strong>Akadēmiskās stundas: {group.academicHours} </strong>
            </div>
            <div>
                Minimālais stundu skaits:
                <input
                    className="edit-group-input"
                    type="number"
                    placeholder="Minimālais stundu skaits"
                    value={group.minHours}
                    onChange={(e) => setGroup({ ...group, minHours: e.target.value })}
                    required
                />
            </div>
            <h3>Plānotie mēneši</h3>
            {plannedMonths.map(month => (
                <div key={month}>
                    <h4>{month}</h4>
                    <div>
                        Planotās dienas:
                        <input
                            className="edit-group-input"
                            type="number"
                            placeholder="Plānotas dienas"
                            value={plannedData[month]?.days || ""}
                            onChange={(e) => handlePlannedChange(month, "days", e.target.value)}
                        />
                    </div>
                    <div>
                        Planotās stundas:
                        <input
                            className="edit-group-input"
                            type="number"
                            placeholder="Plānotas stundas"
                            value={plannedData[month]?.hours || ""}
                            onChange={(e) => handlePlannedChange(month, "hours", e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <button className="edit-group-button" onClick={handleUpdateGroup}>Atjaunināt grupu</button>
            <button className="edit-group-button" onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default EditGroup;