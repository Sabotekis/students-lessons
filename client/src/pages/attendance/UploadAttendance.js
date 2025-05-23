import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './attendance.css';
import { useTranslation } from 'react-i18next';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            <h1 className="upload-attendance-title">{t("upload_attendance_title")}</h1>
            <div>
                <input className="upload-attendance-input" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <button className="upload-attendance-file-button" onClick={handleUploadAndAddAttendance}>{t("add")}</button>
            <button className='upload-attendance-file-button' onClick={handleBack}>{t("back")}</button>
        </div>
    );
};

export default UploadFile;