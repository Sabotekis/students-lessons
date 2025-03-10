import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

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
    transform: ${({ sidebar }) => (sidebar ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 250ms ease-in-out, opacity 300ms ease-in-out;
    opacity: ${({ sidebar }) => (sidebar ? "1" : "0")};  
    z-index: 1000;
    box-shadow: ${({ sidebar }) => (sidebar ? "5px 0 15px rgba(0,0,0,0.3)" : "none")};
`;


const SidebarWrap = styled.div`
    width: 100%;
    padding-top: 20px;
`;




const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
    const closeSidebar = () => setSidebar(false); // Function to close sidebar

    return (
        <>
            <IconContext.Provider value={{ color: "#fff" }}>
                <Nav>
                    <NavIcon to="#">
                        <FaIcons.FaBars onClick={showSidebar} />
                    </NavIcon>
                    <h1 style={{ textAlign: "center", marginLeft: "200px", color: "white"}}>
                        Izglītojamo tiešsaistes nodarbībās pavadītā laika 
                    </h1>
                </Nav>
                <SidebarNav sidebar={sidebar}>
                    <SidebarWrap>
                        <NavIcon to="#">
                            <AiIcons.AiOutlineClose onClick={showSidebar} />
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
