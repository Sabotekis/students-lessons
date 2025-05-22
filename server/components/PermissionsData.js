export const PermissionsData = {
    student_management: {
        label: "Student Management",
        permissions: [
            { key: "students.create", label: "Add New" },
            { key: "students.update", label: "Edit" },
            { key: "students.delete", label: "Delete" },
        ]
    },
    group_management: {
        label: "Group Management",
        permissions: [
            { key: "groups.create", label: "Add New" },
            { key: "groups.update", label: "Edit" },
            { key: "groups.delete", label: "Delete" },
            { key: "groups.addStudents", label: "Add Student to Group" },
            { key: "groups.deleteStudents", label: "Remove Student from Group" },
        ]
    },
    session_management: {
        label: "Session Management",
        permissions: [
            { key: "sessions.create", label: "Add New" },
            { key: "sessions.update", label: "Edit" },
            { key: "sessions.delete", label: "Delete" },
            { key: "sessions.finish", label: "Finish" },
            { key: "sessions.google", label: "Sync with Google Calendar" },
            { key: "sessions.microsoft", label: "Sync with Microsoft Calendar" },
        ]
    },
    attendance_management: {
        label: "Attendance Management",
        permissions: [
            { key: "attendances.create", label: "Add New" },
            { key: "attendances.upload", label: "Upload" },
        ]
    },
    certificate_management: {
        label: "Certificate Management",
        permissions: [
            { key: "certificates.create", label: "Add New" },
            { key: "certificates.download", label: "Download" },
        ]
    },
    group_and_certificate_register: {
        label: "Group and Certificate Register",
        permissions: []
    },
    role_management: {
        label: "Role Management",
        permissions: [
            { key: "roles.create", label: "Add New" },
            { key: "roles.assign", label: "Assign" },
        ]
    }
};