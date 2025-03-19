import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import Cookies from "js-cookie";

const Nav = styled.div`
    background: rgba(21, 23, 28, 0.8); /* Glass effect */
    backdrop-filter: blur(10px); /* Frosted glass */
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const NavIcon = styled(Link)`
    padding-left:15px;
    font-size: 2rem;
    color: white;
    display: flex;
    align-items: center;
    transition: transform 200ms ease-in-out;

    &:hover {
        transform: scale(1.1); /* Subtle pop effect */
    }
`;

const SidebarNav = styled.nav`
    background: rgba(21, 23, 28, 0.8); /* Glass effect */
    backdrop-filter: blur(10px); /* Frosted glass */
    width: 280px;
    height: 100vh;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    transform: ${({ $sidebar }) => ($sidebar ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 250ms ease-in-out, opacity 300ms ease-in-out;
    opacity: ${({ $sidebar }) => ($sidebar ? "1" : "0")};  
    z-index: 1000;
    box-shadow: ${({ $sidebar }) => ($sidebar ? "5px 0 15px rgba(0,0,0,0.3)" : "none")};
`;

const SidebarWrap = styled.div`
    width: 100%;
    padding-top: 20px;
`;

const LoginButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 20px;

    &:hover {
        background-color: #45a049;
    }
`;

const LogoutButton = styled.button`
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        background-color: #e53935;
    }
`;

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
                    navigate('/login');
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
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <Nav>
                    <NavIcon to="#">
                        <FaIcons.FaBars 
                            onClick={showSidebar} 
                            style={{ transition: "color 200ms ease-in-out" }}
                            onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                            onMouseLeave={(e) => (e.target.style.color = "white")}
                        />
                    </NavIcon>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <h1
                            style={{
                                textAlign: "center",
                                marginLeft: "200px",
                                color: "white",
                                cursor: "pointer",
                                transition: "color 200ms ease-in-out",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                            onMouseLeave={(e) => (e.target.style.color = "white")}
                        >
                            Izglītojamo tiešsaistes nodarbībās pavadītā laika
                        </h1>
                    </Link>
                    {username ? (
                        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                            <div style={{ color: "white" }}>{username}</div>
                            <LogoutButton 
                                onClick={handleLogout}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
                            >
                                Logout
                            </LogoutButton>
                        </div>
                    ) : (
                        <LoginButton 
                            onClick={handleLogin}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                        >
                            Login
                        </LoginButton>
                    )}
                </Nav>
                <SidebarNav $sidebar={sidebar} ref={sidebarRef}>
                    <SidebarWrap>
                        <NavIcon to="#">
                            <AiIcons.AiOutlineClose 
                                onClick={closeSidebar} 
                                style={{ transition: "color 200ms ease-in-out" }}
                                onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                                onMouseLeave={(e) => (e.target.style.color = "white")}
                            />
                        </NavIcon>
                        {SidebarData.map((item, index) => (
                            <SubMenu item={item} key={index} closeSidebar={closeSidebar} />
                        ))}
                    </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;