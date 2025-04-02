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


import LicenceManagement from "./pages/licence/LicenceManagement";
import LicenceRegister from "./pages/licence-register/LicenceRegister";

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

                <Route path="/licence-management" element={<LicenceManagement />} />
                <Route path="/licence-register" element={<LicenceRegister />} />
            </Routes>
        </>
    );
};

export default ProtectedApp;