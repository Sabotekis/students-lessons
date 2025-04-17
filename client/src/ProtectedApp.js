import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

import StudentManagement from "./pages/student/StudentManagement";
import AddStudent from "./pages/student/AddStudent";
import EditStudent from "./pages/student/EditStudent";
import ViewStudent from "./pages/student/ViewStudent";

import GroupManagement from "./pages/group/GroupManagement";
import AddGroup from "./pages/group/AddGroup";
import EditGroup from "./pages/group/EditGroup";
import ViewGroup from "./pages/group/ViewGroup";

import SessionManagement from "./pages/session/SessionManagement";
import AddSession from "./pages/session/AddSession";
import EditSession from "./pages/session/EditSession";
import ViewSession from "./pages/session/ViewSession";
import SessionHistory from "./pages/session/SessionHistory";

import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import AddAttendance from "./pages/attendance/AddAttendance";
import ViewAttendanceHistory from "./pages/attendance/ViewAttendanceHistory";
import UploadAttendance from "./pages/attendance/UploadAttendance";
import AttendanceReportManagement from "./pages/attendance/AttendanceReportManagement"
import AttendanceReport from "./pages/attendance/AttendanceReport";
import AttendanceGroupReportManagement from "./pages/attendance/AttendanceGroupReportManagement";
import AttendanceGroupReport from "./pages/attendance/AttendanceGroupReport";

import CertificateManagement from "./pages/certificate/CertificateManagement";
import AddCertificate from "./pages/certificate/AddCertificate";

import GroupCertificateRegister from "./pages/groupCertificateRegister/GroupCertificateRegister";
import GroupRegister from "./pages/groupCertificateRegister/GroupRegister";
import CertificateRegister from "./pages/groupCertificateRegister/CertificateRegister";
import GroupRegisterManagement from "./pages/groupCertificateRegister/GroupRegisterManagement";


const ProtectedApp = () => {
    return (
        <>
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student-management" element={<StudentManagement />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
                <Route path="/view-student/:id" element={<ViewStudent />} />

                <Route path="/group-management" element={<GroupManagement />} />
                <Route path="/add-group" element={<AddGroup />} />
                <Route path="/edit-group/:id" element={<EditGroup />} />
                <Route path="/view-group/:id" element={<ViewGroup />} />

                <Route path="/session-management" element={<SessionManagement />} />
                <Route path="/add-session" element={<AddSession />} />
                <Route path="/edit-session/:id" element={<EditSession />} />
                <Route path="/view-session/:id" element={<ViewSession />} />
                <Route path="/session-history" element={<SessionHistory/>} />

                <Route path="/attendance-management" element={<AttendanceManagement />} />
                <Route path="/add-attendance" element={<AddAttendance />} />
                <Route path="/view-attendance-history/:id" element={<ViewAttendanceHistory />} />
                <Route path="/upload-attendance" element={<UploadAttendance />} />
                <Route path="/attendance-report-management" element={<AttendanceReportManagement />} />
                <Route path="/attendance-report" element={<AttendanceReport />} />
                <Route path="/attendance-group-report-management" element={<AttendanceGroupReportManagement />} />
                <Route path="/attendance-group-report/:groupId" element={<AttendanceGroupReport />} />
                
                <Route path="/certificate-management" element={<CertificateManagement />} />
                <Route path="/add-certificate" element={<AddCertificate />} />

                <Route path="/group-certificate-register" element={<GroupCertificateRegister />} />
                <Route path="/group-register/:groupId" element={<GroupRegister />} />
                <Route path="/certificate-register" element={<CertificateRegister />} />
                <Route path="/group-register-management" element={<GroupRegisterManagement />} />
            </Routes>
        </>
    );
};

export default ProtectedApp;