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
import { Navbar, Nav, Button } from "react-bootstrap";

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const [username, setUsername] = useState(null);
    const [sections, setSections] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                <Navbar className={`nav p-0 ${isMobile ? 'nav-mobile' : ''}`} fixed="top">
                    <div className="nav-left-section">
                        <Nav.Link as={Link} to="#" className="nav-icon">
                            <FaIcons.FaBars 
                                onClick={showSidebar} 
                                onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                                onMouseLeave={(e) => (e.target.style.color = "white")}
                            />
                        </Nav.Link>
                        
                        {!isMobile && <LanguageSwitcher variant="sidebar"/>}
                    </div>
                    
                    <Navbar.Brand 
                        as={Link} 
                        to="/" 
                        className={`nav-title ${isMobile ? 'nav-title-mobile' : ''}`}
                        style={{ 
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                        }}
                    >
                        {t("app_name")}
                    </Navbar.Brand>
                    
                    {username ? (
                        <div className={`user-actions ${isMobile ? 'user-actions-mobile' : ''}`}>
                            {!isMobile && <div className="username">{username}</div>}
                            <Button 
                                className="logout-button"
                                onClick={handleLogout}
                                size={isMobile ? "sm" : "md"}
                                style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    padding: isMobile ? "6px 12px" : "10px 20px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 200ms ease-in-out",
                                    fontSize: isMobile ? "14px" : "16px",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
                            >
                                {t("logout")}
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            className="login-button"
                            onClick={handleLogin}
                            size={isMobile ? "sm" : "md"}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                padding: isMobile ? "6px 12px" : "10px 20px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 200ms ease-in-out",
                                fontSize: isMobile ? "14px" : "16px",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                        >
                            {t("login")}
                        </Button>
                    )}
                </Navbar>
                
                <nav className={`sidebar-nav ${sidebar ? 'active' : ''} ${isMobile ? 'sidebar-nav-mobile' : ''}`} ref={sidebarRef}>
                    <div className="sidebar-wrap">
                        <div className="sidebar-header">
                            <Nav.Link as={Link} to="#" className="nav-icon">
                                <AiIcons.AiOutlineClose 
                                    onClick={closeSidebar} 
                                    onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                                    onMouseLeave={(e) => (e.target.style.color = "white")}
                                />
                            </Nav.Link>
                            {isMobile && (
                                <div className="sidebar-mobile-info">
                                    <LanguageSwitcher variant="sidebar"/>
                                </div>
                            )}
                        </div>
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