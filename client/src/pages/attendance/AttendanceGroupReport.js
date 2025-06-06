import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import "./attendance.css";
import { useTranslation } from "react-i18next";

const AttendanceGroupReport = () => {
    const { groupId } = useParams();
    const [reportData, setReportData] = useState([]);
    const [groupTitle, setGroupTitle] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!groupId) return;

        fetch(`/api/groups/${groupId}/report`)
            .then(response => response.json())
            .then(data => setReportData(data))
            .catch(error => console.error("Error fetching group report:", error));

        fetch(`/api/groups/${groupId}`)
            .then(response => response.json())
            .then(data => setGroupTitle(data.title))
            .catch(error => console.error("Error fetching group title:", error));
    }, [groupId]);

    const handleBack = () => {
        navigate("/attendance-group-report-management");
    };

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Apmeklējuma grupas atskaite");
        worksheet.properties.defaultRowHeight = 20;

        worksheet.addRow([
            "Vārds Uzvārds", 
            "Apgūto stundu skaits kopā", 
            "Statuss", 
            "Apliecības veids", 
            "Apliecības numurs", 
            "Mācību periods", 
            "Izsniegšanas datums"
        ]);
        
        reportData.forEach((student, index) => {
            worksheet.addRow([
                student.name,
                student.totalHours,
                student.status,
                student.certificateType,
                student.certificateNumber,
                student.period,
                student.issueDate,
            ]);
        });

        worksheet.getRow(1).height = 35;

        worksheet.columns.forEach((column, index) => {
            if (index === 0) {
                column.width = 14; 
            } else if (index === 1) {
                column.width = 12; 
            } else if (index === 2) {
                column.width = 21; 
            } else if (index === 3) {
                column.width = 13; 
            } else if (index === 4) {
                column.width = 13; 
            } else if (index === 5) {
                column.width = 21; 
            } else if (index === 6) {
                column.width = 13; 
            }
        });

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
                cell.font = { size: 10 };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin"},
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
    
                if (rowNumber <= 1) {
                    cell.font = { bold: true, size: 12 };
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "D9EAD3" }, 
                    };
                }
            });
        });


        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Attendance_Report_${groupTitle}.xlsx`;
        link.click();
    };    

    return (
        <div className="attendance-group-report-container">
            <h1 className="attendance-group-report-title">{t("attendance_group_report_title")}</h1>
            {reportData.length > 0 ? (
                <table className="attendance-group-report-table">
                    <thead>
                        <tr>
                            <th>{t("name_and_surname")}</th>
                            <th>{t("number_of_hours_studied")}</th>
                            <th>{t("status")}</th>
                            <th>{t("certificate_type")}</th>
                            <th>{t("certificate_number")}</th>
                            <th>{t("period_of_study")}</th>
                            <th>{t("issue_date")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name}</td>
                                <td>{student.totalHours}</td>
                                <td>{student.status}</td>
                                <td>{student.certificateType}</td>
                                <td>{student.certificateNumber}</td>
                                <td>{student.period}</td>
                                <td>{student.issueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{t("data_none")}</p>
            )}
            <button className="attendance-group-report-button" onClick={handleExportToExcel}>
                {t("export_to_excel")}	
            </button>
            <button className="attendance-group-report-button" onClick={handleBack}>
                {t("back")}
            </button>
        </div>
    );
};

export default AttendanceGroupReport;