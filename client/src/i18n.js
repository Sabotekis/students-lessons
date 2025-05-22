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
                    //SidebarData + labels from PermissionsData
                    "Student Management": "Studentu pārvaldība",
                    "Group Management": "Grupu pārvaldība",
                    "Session Management": "Sesiju pārvaldība",
                    "Attendance Management": "Apmeklejuma pārvaldība",
                    "Certificate Management": "Apliecību pārvaldība",
                    "Group and Certificate Register": "Grupu un Apliecību reģistrs",
                    "Role Management": "Lomu pārvaldība",

                    //All pages
                    "back": "Atgriezties",
                    "view": "Apskatīt",
                    "edit": "Rediģēt",
                    "delete": "Izdzēst",
                    "add": "Pievienot",
                    "update": "Atjaunināt",
                    "remove": "Nodzēst",

                    //Sidebar + Login
                    "app_name": "Izglītojamo tiešsaistes nodarbībās pavadītā laika",
                    "logout": "Iziet",
                    "login": "Ienākt",
                    "email": "E-pasts",
                    "password": "Parole",

                    //Home
                    "app_description": "Šī vietne ir paredzēta studentu un grupu pārvaldībai. Varat pievienot, rediģēt un skatīt studentus un grupas, kā arī pārvaldīt dažādus citus ar studentu pārvaldību saistītus aspektus.",

                    //Student Management + Add Student + Edit Student + View Student
                    "student_title": "Studentu pārvaldība",
                    "student_name": "Vārds",
                    "student_surname": "Uzvārds",
                    "student_personal_code": "Personas kods",
                    "student_phone_number": "Tālruņa numurs",
                    "student_email": "E-pasts",
                    "student_academic_hours": "Akadēmiskās stundas",
                    "student_search": "Meklēt",
                    "student_none": "Nav pieejamu studentu",
                    "student_add": "Pievienot studentu",
                    "add_student_title": "Studentu pievienošana",
                    "edit_student_title": "Studentu rediģēšana",
                    "view_student_title": "Studentu apskatīšana",
                    "groups": "Grupas",

                    //Group Management + Add Group + Edit Group	+ View Group
                    "group_title": "Grupu pārvaldība",
                    "group_register_number": "Grupas reģistra numurs",
                    "group_name": "Nosaukums",
                    "group_start_date": "Sākuma datums",
                    "group_end_date": "Beigu datums",
                    "group_professor": "Profesors",
                    "group_academic_hours": "Akadēmiskās stundas",
                    "group_min_hours": "Minimālais stundu skaits",
                    "group_add": "Pievienot grupu",
                    "add_group_title": "Grupu pievienošana",
                    "group_planned_months": "Plānotie mēneši",
                    "group_planned_days": "Plānotās dienas",
                    "group_planned_hours": "Plānotās stundas",
                    "edit_group_title": "Grupas rediģēšana",
                    "view_group_title": "Grupas apskatīšana",
                    "group_planned_data": "Plānotās dienas un stundas",
                    "days": "Dienas",
                    "hours": "Stundas",
                    "students": "Studenti",

                    //Session Management + Add Session + Edit Session + View Session + Session History
                    "session_title": "Apmācību sesiju pārvaldība",
                    "session_start_date": "Sākuma datums",
                    "session_end_date": "Beigu datums",
                    "session_finish": "Pabeigt",
                    "session_add": "Pievienot sesiju",
                    "session_history": "Sesijas vēsture",
                    "google_calendar": "Google kalendārs",
                    "google_login": "Ienākt ar Google",
                    "google_logout": "Iziet no Google",
                    "sync_google_calendar": "Sinhronizēt ar Google kalendāru",
                    "microsoft_calendar": "Microsoft kalendārs",
                    "microsoft_login": "Ienākt ar Microsoft",
                    "microsoft_logout": "Iziet no Microsoft",
                    "sync_microsoft_calendar": "Sinhronizēt ar Microsoft kalendāru",
                    "add_session_title": "Apmācību sesiju pievienošana",
                    "group_choose": "Izvēlieties grupu",
                    "add_all_students": "Pievienot visus",
                    "remove_all_students": "Noņemt visus",
                    "student_or_group_none": "Šajā grupā nav studentu vai grupa nav izvēlēta",
                    "edit_session_title": "Apmācību sesiju rediģēšana",
                    "student_deleted": "Šis students ir dzēsts",
                    "view_session_title": "Apmācību sesiju apskatīšana",
                    "group": "Grupa",
                    "session_history_title": "Apmācību sesiju vēsture",
                    "session_history_none": "Neviena sesija nav pabeigta",

                }
            },
            en: {
                translation: {
                    //Sidebar Data + labels from PermissionsData
                    "Student Management": "Student Management",
                    "Group Management": "Group Management",
                    "Session Management": "Session Management",
                    "Attendance Management": "Attendance Management",
                    "Certificate Management": "Certificate Management",
                    "Group and Certificate Register": "Group and Certificate Register",
                    "Role Management": "Role Management",

                    //All pages
                    "back": "Back",
                    "view": "View",
                    "edit": "Edit",
                    "delete": "Delete",
                    "add": "Add",
                    "update": "Update",
                    "remove": "Remove",

                    //Sidebar + Login
                    "app_name": "Time spent by students in online lessons",
                    "logout": "Logout",
                    "login": "Login",
                    "email": "Email",
                    "password": "Password",

                    //Home
                    "app_description": "This website is designed for managing students and groups. You can add, edit, and view students and groups, as well as manage various other aspects related to student management.",

                    //Student Management + Add Student + Edit Student + View Student
                    "student_title": "Student Management",
                    "student_name": "Name",
                    "student_surname": "Surname",
                    "student_personal_code": "Personal Code",
                    "student_phone_number": "Phone Number",
                    "student_email": "Email",
                    "student_academic_hours": "Academic Hours",
                    "student_search": "Search",
                    "student_none": "No students available",
                    "student_add": "Add Student",
                    "add_student_title": "Add Student",
                    "edit_student_title": "Edit Student",
                    "view_student_title": "View Student",
                    "groups": "Groups",

                    //Group Management + Add Group + Edit Group
                    "group_title": "Group Management",
                    "group_register_number": "Group Register Number",
                    "group_name": "Name",
                    "group_start_date": "Start Date",
                    "group_end_date": "End Date",
                    "group_professor": "Professor",
                    "group_academic_hours": "Academic Hours",
                    "group_min_hours": "Minimum Hours",
                    "group_add": "Add Group",
                    "add_group_title": "Add Group",
                    "group_planned_months": "Planned Months",
                    "group_planned_days": "Planned Days",
                    "group_planned_hours": "Planned Hours",
                    "edit_group_title": "Edit Group",
                    "view_group_title": "View Group",
                    "group_planned_data": "Planned Days and Hours",
                    "days": "Days",
                    "hours": "Hours",
                    "students": "Students",

                    //Session Management + Add Session + Edit Session + View Session + Session History
                    "session_title": "Session Management",
                    "session_start_date": "Start Date",
                    "session_end_date": "End Date",
                    "session_finish": "Finish",
                    "session_add": "Add Session",
                    "session_history": "Session History",
                    "google_calendar": "Google Calendar",
                    "google_login": "Login with Google",
                    "google_logout": "Logout from Google",
                    "sync_google_calendar": "Sync with Google Calendar",
                    "microsoft_calendar": "Microsoft Calendar",
                    "microsoft_login": "Login with Microsoft",
                    "microsoft_logout": "Logout from Microsoft",
                    "sync_microsoft_calendar": "Sync with Microsoft Calendar",
                    "add_session_title": "Add Session",
                    "group_choose": "Choose a group",
                    "add_all_students": "Add all",
                    "remove_all_students": "Remove all",
                    "student_or_group_none": "No students in this group or no group selected",
                    "edit_session_title": "Edit Session",
                    "student_deleted": "This student has been deleted",
                    "view_session_title": "View Session",
                    "group": "Group",
                    "session_history_title": "Session History",
                    "session_history_none": "No sessions finished",
                }
            }
        },
        fallbackLng: "lv",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;