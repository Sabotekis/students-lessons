import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            lv: {
                translation: {
                    // SidebarData PermissionsData And All pages
                    //Sidebar
                    "app_name": "Izglītojamo tiešsaistes nodarbībās pavadītā laika",
                    "logout": "Iziet",
                    "login": "Ienākt",

                    //Sidebar Data
                    "Student Management": "Studentu pārvaldība",
                    "Group Management": "Grupu pārvaldība",
                    "Session Management": "Sesiju pārvaldība",
                    "Attendance Management": "Apmeklejuma pārvaldība",
                    "Certificate Management": "Apliecību pārvaldība",
                    "Group and Certificate Register": "Grupu un Apliecību reģistrs",
                    "Role Management": "Lomu pārvaldība",
                }
            },
            en: {
                translation: {
                    //Sidebar
                    "app_name": "Time spent by students in online lessons",
                    "logout": "Logout",
                    "login": "Login",

                    //Sidebar Data
                    "Student Management": "Student Management",
                    "Group Management": "Group Management",
                    "Session Management": "Session Management",
                    "Attendance Management": "Attendance Management",
                    "Certificate Management": "Certificate Management",
                    "Group and Certificate Register": "Group and Certificate Register",
                    "Role Management": "Role Management",
                }
            }
        },
        fallbackLng: "lv",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;