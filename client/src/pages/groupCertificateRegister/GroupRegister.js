import React, {useEffect, useState} from "react";
import './groupCertificate.css';
import { useNavigate, useParams } from "react-router-dom";


const GroupRegister = () => {
    const { groupId } = useParams();
    const [registerData, setRegisterData] = useState([]);
    const [groupInfo, setGroupInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/groups/${groupId}/register`)
            .then(response => response.json())
            .then(data => setRegisterData(data))
            .catch(error => console.error("Error fetching group register data:", error));
        fetch(`/api/groups/${groupId}`)
            .then(response => response.json())
            .then(data => setGroupInfo(data))
            .catch(error => console.error("Error fetching group info:", error));
    }, [groupId]);

    const handleBack = () => {
        navigate("/group-certificate-register");
    };

    return (
        <div className="group-register-container">
            <h1 className="group-register-title">Grupu Reģistrs</h1>
            <table className="group-register-table">
                <tbody>
                    <tr>
                        <th>Grupas Reģistrācijas Nr.</th>
                        <td>{groupInfo.registerNumber}</td>
                    </tr>
                    <tr>
                        <th>Grupas nosaukums</th>
                        <td>{groupInfo.title}</td>
                    </tr>
                    <tr>
                        <th>Akademiskas stundas</th>
                        <td>{groupInfo.academicHours}</td>
                    </tr>
                    <tr>
                        <th>Apguves Periods</th>
                        <td>{new Date(groupInfo.startDate).toLocaleDateString("lv-LV")} - {new Date(groupInfo.endDate).toLocaleDateString("lv-LV")}</td>
                    </tr>
                </tbody>
            </table>
            <table className="group-register-main-table">
                <thead>
                    <tr>
                        <th>Vārds Uzvārds</th>
                        <th>Personas Kods</th>
                        <th>Ieskaitīts/Neieskaitīts</th>
                        <th>Izglītības dokumenta veids</th>
                        <th>Izglītības dokumenta numurs</th>
                        <th>Izglītības dokumenta sagatavošanas datums</th>
                    </tr>
                </thead>
                <tbody>
                    {registerData.map((student, index) => (
                        <tr key={index}>
                            <td>{student.name}</td>
                            <td>{student.personalCode}</td>
                            <td>{student.status}</td>
                            <td>{student.certificateType}</td>
                            <td>{student.certificateNumber}</td>
                            <td>{student.issueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="group-register-button" onClick={handleBack}>
                Atgriezties
            </button>
        </div>
    );
};

export default GroupRegister;
