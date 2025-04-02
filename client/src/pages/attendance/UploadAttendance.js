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
            alert('Please select a file first');
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
                alert('Error uploading file: ' + uploadData.message);
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
                alert('Error adding attendance: ' + attendanceData.message);
                return;
            }

            alert('Attendance successfully uploaded and added');
            navigate('/attendance-management'); 
        } catch (error) {
            console.error('Error processing file:', error);
            alert('An error occurred while processing the file');
        }
    };

    const handleBack = () => {
        navigate('/attendance-management');
    };

    return (
        <div className='upload-attendance-container'>
            <h1 className="upload-attendance-title">Upload Attendance CSV</h1>
            <input className="upload-attendance-input" type="file" accept=".csv" onChange={handleFileChange} />
            <button className="upload-attendance-file-button" onClick={handleUploadAndAddAttendance}>Add attendance</button>
            <button className='upload-attendance-file-button' onClick={handleBack}>Back</button>
        </div>
    );
};

export default UploadFile;