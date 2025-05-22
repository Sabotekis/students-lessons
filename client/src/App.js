import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import Login from "./pages/Login";
import ProtectedApp from "./ProtectedApp";

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

const AppRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedApp />} />
        </Routes>
    );
};

export default App;