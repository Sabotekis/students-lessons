import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentManagement from "./pages/StudentManagement";
import GroupManagement from "./pages/GroupManagement";
import StudyingSessionManagement from "./pages/StudyingSessionManagement";
import AppointmentRegister from "./pages/AppointmentRegister";
import LicenceManagement from "./pages/LicenceManagement";
import LicenceRegister from "./pages/LicenceRegister";
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import ViewGroup from "./pages/ViewGroup";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewStudent from "./pages/ViewStudent";
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
                <Route path="/student-management" element={<StudentManagement isLoggedIn={isLoggedIn} />} />
                <Route path="/group-management" element={<GroupManagement isLoggedIn={isLoggedIn} />} />
                <Route path="/studying-session-management" element={<StudyingSessionManagement />} />
                <Route path="/appointment-register" element={<AppointmentRegister />} />
                <Route path="/licence-management" element={<LicenceManagement />} />
                <Route path="/licence-register" element={<LicenceRegister />} />
                <Route path="/add-group" element={isLoggedIn ? <AddGroup /> : <Home />} />
                <Route path="/edit-group/:id" element={ isLoggedIn ? <EditGroup /> : <Home />} />
                <Route path="/view-group/:id" element={<ViewGroup />} />
                <Route path="/add-student" element={isLoggedIn ? <AddStudent /> : <Home />} />
                <Route path="/edit-student/:id" element={isLoggedIn ? <EditStudent /> : <Home/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/view-student/:id" element={<ViewStudent />} />
            </Routes>
        </Router>
    );
}

export default App;