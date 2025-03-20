import React, { useState } from "react";
import { Link } from "react-router-dom";
import './sidebar.css';

const SubMenu = ({ item, closeSidebar }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <Link 
                to={item.path} 
                className="sidebar-link" 
                onClick={item.subNav ? showSubnav : closeSidebar}
            >
                <div>
                    {item.icon}
                    <span className="sidebar-label">{item.title}</span>
                </div>
                <div>
                    {item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}
                </div>
            </Link>
            {subnav &&
                item.subNav.map((subItem, index) => {
                    return (
                        <Link 
                            to={subItem.path} 
                            key={index} 
                            className="dropdown-link" 
                            onClick={closeSidebar}
                        >
                            {subItem.icon}
                            <span className="sidebar-label">{subItem.title}</span>
                        </Link>
                    );
                })}
        </>
    );
};

export default SubMenu;
