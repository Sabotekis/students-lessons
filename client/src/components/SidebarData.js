import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: "Studentu Parvaldiba",
        path: "/studentu-parvaldiba",
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
        title: "Grupu Parvaldiba",
        path: "/grupu-parvaldiba",
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
        title: "Apmacicbu Sessiju Parvaldiba",
        path: "/apmacibu-sessiju-parvaldiba",
        icon: <FaIcons.FaPhone />,
    },
    {
        title: "Apmeklejuma Uzskaite",
        path: "/apmeklejuma-uzskaite",
        icon: <FaIcons.FaEnvelopeOpenText />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
        title: "Apliecibu Parvaldiba",
        path: "/apliecibu-parvaldiba",
        icon: <IoIcons.IoMdHelpCircle />,
    },
    {
        title: "Apliecibu Registrs",
        path: "/apliecibu-registrs",
        icon: <IoIcons.IoMdHelpCircle />,
    },
];
