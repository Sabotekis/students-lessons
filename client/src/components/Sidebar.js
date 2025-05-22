import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { getSidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import Cookies from "js-cookie";
import "./sidebar.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const [username, setUsername] = useState(null);
    const [sections, setSections] = useState({});
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const { t } = useTranslation();

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
                    if (data.user.role && data.user.role.sections) {
                        setSections(data.user.role.sections);
                    } else {
                        setSections({}); 
                    }
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
                    <LanguageSwitcher variant="sidebar"/>
                    <Link to="/" className="nav-title">
                        {t("app_name")}
                    </Link>
                    {username ? (
                        <div className="user-actions">
                            <div className="username">{username}</div>
                            <button 
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                {t("logout")}
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="login-button"
                            onClick={handleLogin}
                        >
                            {t("login")}
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
                        {getSidebarData(t).filter(item => sections[item.key] === true).map((item, index) => (
                            <SubMenu item={item} key={index} closeSidebar={closeSidebar} />
                        ))}
                    </div>
                </nav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;