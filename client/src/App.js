import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import AppointmentRegister from "./pages/appointment/AppointmentRegister";
import LicenceManagement from "./pages/licence/LicenceManagement";
import LicenceRegister from "./pages/licence-register/LicenceRegister";

import Home from "./pages/Home";
import Login from "./pages/Login";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <Router>
            <Sidebar isLoggedIn={isLoggedIn}/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route path="/student-management" element={<StudentManagement isLoggedIn={isLoggedIn} />} />
                <Route path="/add-student" element={isLoggedIn ? <AddStudent /> : <Home />} />
                <Route path="/edit-student/:id" element={isLoggedIn ? <EditStudent /> : <Home/>} />
                <Route path="/view-student/:id" element={<ViewStudent isLoggedIn={isLoggedIn}/>} />

                <Route path="/group-management" element={<GroupManagement isLoggedIn={isLoggedIn} />} />
                <Route path="/add-group" element={isLoggedIn ? <AddGroup /> : <Home />} />
                <Route path="/edit-group/:id" element={ isLoggedIn ? <EditGroup /> : <Home />} />
                <Route path="/view-group/:id" element={<ViewGroup isLoggedIn={isLoggedIn}/>} />

                <Route path="/session-management" element={<SessionManagement />} />
                <Route path="/add-session" element={<AddSession />} />
                <Route path="/edit-session/:id" element={<EditSession />} />
                <Route path="/view-session/:id" element={<ViewSession />} />

                <Route path="/appointment-register" element={<AppointmentRegister />} />
                <Route path="/licence-management" element={<LicenceManagement />} />
                <Route path="/licence-register" element={<LicenceRegister />} />
                
            </Routes>
        </Router>
    );
}

export default App;