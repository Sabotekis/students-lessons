import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadAndAddAttendance = async () => {
        if (!file) {
            alert('Vispirms pievienojiet failu');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadResponse = await fetch('/api/attendance/upload-csv', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                alert('Kļūda augšupielādējot failu: ' + uploadData.message);
                return;
            }

            const { meetingTitle, startTime, presenters } = uploadData;

            const attendanceResponse = await fetch('/api/attendance/upload-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetingTitle, startTime, presenters }),
            });

            const attendanceData = await attendanceResponse.json();

            if (!attendanceResponse.ok) {
                alert('Kļūda, pievienojot apmeklējumu: ' + attendanceData.message);
                return;
            }

            navigate('/attendance-management'); 
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Apstrādājot failu, ir notikusi kļūda');
        }
    };

    const handleBack = () => {
        navigate('/attendance-management');
    };

    return (
        <div className='upload-attendance-container'>
            <h1 className="upload-attendance-title">Apmeklējuma CSV augšupielāde</h1>
            <div>
                <input className="upload-attendance-input" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <button className="upload-attendance-file-button" onClick={handleUploadAndAddAttendance}>Pievienot apmeklējumu</button>
            <button className='upload-attendance-file-button' onClick={handleBack}>Atgriezties</button>
        </div>
    );
};

export default UploadFile;