import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import Cookies from "js-cookie";
import './sidebar.css';

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            fetch('/api/auth/protected', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(response => {
                if (response.status === 401) {
                    Cookies.remove('token');
                    setUsername(null);
                    navigate('/login');
                    window.location.reload();
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    setUsername(data.user.email);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navigate]);

    const showSidebar = () => setSidebar(!sidebar);
    const closeSidebar = () => setSidebar(false); 

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setUsername(null);
        navigate('/login');
        window.location.reload();
    };

    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <div className="nav">
                    <Link to="#" className="nav-icon">
                        <FaIcons.FaBars 
                            onClick={showSidebar} 
                            onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                            onMouseLeave={(e) => (e.target.style.color = "white")}
                        />
                    </Link>
                    <Link to="/" className="nav-title">
                        Izglītojamo tiešsaistes nodarbībās pavadītā laika
                    </Link>
                    {username ? (
                        <div className="user-actions">
                            <div className="username">{username}</div>
                            <button 
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="login-button"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    )}
                </div>
                <nav className={`sidebar-nav ${sidebar ? 'active' : ''}`} ref={sidebarRef}>
                    <div className="sidebar-wrap">
                        <Link to="#" className="nav-icon">
                            <AiIcons.AiOutlineClose 
                                onClick={closeSidebar} 
                                onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                                onMouseLeave={(e) => (e.target.style.color = "white")}
                            />
                        </Link>
                        {SidebarData.map((item, index) => (
                            <SubMenu item={item} key={index} closeSidebar={closeSidebar} />
                        ))}
                    </div>
                </nav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;