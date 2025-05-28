import { useEffect, useState } from "react";
import './certificate.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddCertificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newCertificate, setNewCertificate] = useState({
        student: '',
        group: '',
        issueData: '',
    });
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetch('/api/students') 
            .then((res) => res.json())
            .then((data) => setStudents(data));

        fetch('/api/groups')
            .then((res) => res.json())
            .then((data) => setGroups(data));
    }, []);

    const handleGroupChange = (groupId) => {
        setNewCertificate({
            ...newCertificate,
            group: groupId,
            student: '',
        });
        fetch(`/api/certificates/eligible-students/${groupId}`)
            .then((res) => res.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error('Error fetching eligible students:', error));
    };

    const handleAddCertificate = () => {
        if (!newCertificate.group || !newCertificate.student) {
            alert("Visi lauki ir obligāti");
            return;
        }

        fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCertificate),
        })
            .then((res) => res.json())
            .then((data) => setCertificates([...certificates, data]))
            .catch((err) => console.error('Error:', err));
            navigate('/certificate-management'); 
    };

    const handleBack = () => {
        navigate('/certificate-management');
    };

    return (
        <div className="add-certificate-container">
            <h2 className="add-certificate-title">{t("add_certificate_title")}</h2>
            <div>
                <select
                    className="add-certificate-select"
                    name="group"
                    value={newCertificate.group}
                    onChange={(e) => handleGroupChange(e.target.value)}
                >
                    <option value="">{t("group_choose")}</option>
                    {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                            {group.title}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select
                    className="add-certificate-select"
                    name="student"
                    value={newCertificate.student}
                    onChange={(e) => setNewCertificate({ ...newCertificate, student: e.target.value })}
                    disabled={!newCertificate.group}
                >
                    <option value="">{t("student_choose")}</option>
                    {students.map((student) => (
                        <option key={student.id || student._id} value={student.id || student._id}>
                            {student.name} {student.surname}
                        </option>
                    ))}
                </select>
            </div>
            <button className="add-certificate-button" type="button" onClick={handleAddCertificate}>
                {t("add")}
            </button>
            <button className="add-certificate-button" type="button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default AddCertificate;