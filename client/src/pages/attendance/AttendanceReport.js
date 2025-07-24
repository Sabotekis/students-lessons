import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { Container, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const AttendanceReport = () => {
    const location = useLocation();
    const { groupId, month } = location.state || {};
    const [reportData, setReportData] = useState([]);
    const [groupInfo, setGroupInfo] = useState({});
    const [daysInMonth, setDaysInMonth] = useState(31);
    const [plannedDays, setPlannedDays] = useState(0);
    const [plannedHours, setPlannedHours] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!groupId || !month) return;

        fetch(`/api/attendance/report/html/${groupId}/${month}`)
            .then(response => response.json())
            .then(data => {
                setReportData(data.report);
                setDaysInMonth(data.daysInMonth);
                setPlannedDays(data.plannedDays);
                setPlannedHours(data.plannedHours);
            });

        fetch(`/api/groups/${groupId}`)
            .then(response => response.json())
            .then(data => setGroupInfo(data))
            .catch(error => console.error("Error fetching group info:", error));
    }, [groupId, month]);

    const handleBack = () => {
        navigate("/attendance-report-management");
    };

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance Report");
        worksheet.properties.defaultRowHeight = 20;
    
        const monthName = new Date(`${month}-01`).toLocaleDateString("lv", { month: "long", year: "numeric" });

        worksheet.addRow(["Grupa:", groupInfo.title || "N/A"]);
        worksheet.addRow([
            "Apmācības periods:",
            groupInfo.startDate && groupInfo.endDate
                ? `${new Date(groupInfo.startDate).toLocaleDateString()} - ${new Date(groupInfo.endDate).toLocaleDateString()}`
                : "N/A",
        ]);
        worksheet.addRow([]);

        worksheet.addRow([
            "Nr.", "Apmācāmā vārds, uzvārds", ...Array.from({ length: daysInMonth }, () => monthName), "Plānotais apmācības ilgums", "", "Faktiskais apmācību ilgums", "",
        ]);

        worksheet.addRow([
            "", "", ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), "Dienas", "Stundas", "Dienas", "Stundas",
        ]);

        reportData.forEach((row, index) => {
            worksheet.addRow([
                index + 1,
                row.name,
                ...Array.from({ length: daysInMonth }, (_, i) => row.dailyMinutes[i] === null ? "" : row.dailyMinutes[i]),
                plannedDays,
                plannedHours,
                row.actualDays,
                row.actualHours,
            ]);
        });

        worksheet.columns.forEach((column, index) => {
            if (index === 0 || index === 1) {
                column.width = 25; 
            } else if (index > 1 && index <= daysInMonth + 1) {
                column.width = 4; 
            } else {
                column.width = 15; 
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
    
                if (rowNumber <= 5) {
                    cell.font = { bold: true, size: 12 };
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "D9EAD3" }, 
                    };
                }
            });
        });
        worksheet.mergeCells('C4:AG4');
        worksheet.mergeCells('A4:A5');
        worksheet.mergeCells('B4:B5');
        worksheet.mergeCells('AH4:AI4');
        worksheet.mergeCells('AJ4:AK4');

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Attendance_Report_${month}.xlsx`;
        link.click();
    };

    if (!groupId || !month) {
        return (
            <Container fluid className="mt-4">
                <Row>
                    <Col xs={12}>
                        <Alert variant="warning" className="text-center">
                            {t("attendance_report_none")}
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );    
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col xs={12}>
                    <h1 className="text-center mb-4">{t("attendance_report_title")}</h1>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12}>
                    <div className="table-responsive" style={{ maxWidth: '500px' }}>
                        <Table striped bordered size="sm" className="mb-0">
                            <tbody>
                                <tr>
                                    <th>{t("group")}:</th>
                                    <td>{groupInfo.title}</td>
                                </tr>
                                <tr>
                                    <th>{t("period")}:</th>
                                    <td>
                                        {groupInfo.startDate && groupInfo.endDate 
                                            ? `${new Date(groupInfo.startDate).toLocaleDateString()} - ${new Date(groupInfo.endDate).toLocaleDateString()}`
                                            : 'N/A'
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="table-responsive">
                        <Table striped bordered hover size="sm">
                            <thead className="table-dark">
                                <tr>
                                    <th rowSpan="2">{t("number")}</th>
                                    <th rowSpan="2">{t("name_and_surname")}</th>
                                    <th colSpan={daysInMonth} className="text-center">
                                        {new Date(`${month}-01`).toLocaleDateString("lv", { month: "long", year: "numeric" })}
                                    </th>
                                    <th colSpan="2" className="text-center">{t("planned_studying_duration")}</th>
                                    <th colSpan="2" className="text-center">{t("real_studying_duration")}</th>
                                </tr>
                                <tr>
                                    {Array.from({ length: daysInMonth }, (_, i) => (
                                        <th key={i + 1} className="text-center" style={{ minWidth: '30px' }}>
                                            {i + 1}
                                        </th>
                                    ))}
                                    <th className="text-center">{t("days")}</th>
                                    <th className="text-center">{t("hours")}</th>
                                    <th className="text-center">{t("days")}</th>
                                    <th className="text-center">{t("hours")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{row.name}</td>
                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                            <td key={i + 1} className="text-center">
                                                {row.dailyMinutes[i] === null ? "" : row.dailyMinutes[i]}
                                            </td>
                                        ))}
                                        <td className="text-center">{plannedDays}</td>
                                        <td className="text-center">{plannedHours}</td>
                                        <td className="text-center">{row.actualDays}</td>
                                        <td className="text-center">{row.actualHours}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            
            <Row className="mb-3">
                <Col xs={12} className="text-center">
                    <div className="d-grid gap-2 d-md-block">
                        <Button variant="success" onClick={handleExportToExcel} className="me-2">
                            {t("export_to_excel")}
                        </Button>
                        <Button variant="danger" onClick={handleBack} className="me-2">
                            {t("back")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AttendanceReport;