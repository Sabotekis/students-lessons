import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceGroupReportManagement = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    }, []);

    const handleGenerateReport = () => {
        if (!selectedGroup) {
            alert("Please select a group.");
            return;
        }

        navigate(`/attendance-group-report/${selectedGroup}`);
    };

    const handleBack = () => {
        navigate("/attendance-management");
    };

    return (
        <div className="attendance-group-report-management-container">
            <h1 className="attendance-group-report-management-title">Group Report Management</h1>
            <select
                className="attendance-group-report-management-select"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
            >
                <option value="">Select Group</option>
                {groups.map(group => (
                    <option key={group._id} value={group._id}>
                        {group.title}
                    </option>
                ))}
            </select>
            <button className="attendance-group-report-management-button" onClick={handleGenerateReport}>
                Generate Report
            </button>
            <button className="attendance-group-report-management-button" onClick={handleBack}>
                Back
            </button>
        </div>
    );
};

export default AttendanceGroupReportManagement;