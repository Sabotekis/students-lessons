export const getPermissionsData = (t) => ({
    student_management: {
        label: t("Student Management"),
        permissions: [
            { key: "students.create", label: t("Add New") },
            { key: "students.update", label: t("Edit") },
            { key: "students.delete", label: t("Delete") },
        ]
    },
    group_management: {
        label: t("Group Management"),
        permissions: [
            { key: "groups.create", label: t("Add New") },
            { key: "groups.update", label: t("Edit") },
            { key: "groups.delete", label: t("Delete") },
            { key: "groups.addStudents", label: t("Add Student to Group") },
            { key: "groups.deleteStudents", label: t("Remove Student from Group") },
        ]
    },
    session_management: {
        label: t("Session Management"),
        permissions: [
            { key: "sessions.create", label: t("Add New") },
            { key: "sessions.update", label: t("Edit") },
            { key: "sessions.delete", label: t("Delete") },
            { key: "sessions.finish", label: t("Finish") },
            { key: "sessions.google", label: t("Sync with Google Calendar") },
            { key: "sessions.microsoft", label: t("Sync with Microsoft Calendar") },
        ]
    },
    attendance_management: {
        label: t("Attendance Management"),
        permissions: [
            { key: "attendances.create", label: t("Add New") },
            { key: "attendances.upload", label: t("Upload") },
        ]
    },
    certificate_management: {
        label: t("Certificate Management"),
        permissions: [
            { key: "certificates.create", label: t("Add New") },
            { key: "certificates.download", label: t("Download") },
        ]
    },
    group_and_certificate_register: {
        label: t("Group and Certificate Register"),
        permissions: []
    },
    role_management: {
        label: t("Role Management"),
        permissions: [
            { key: "roles.create", label: t("Add New") },
            { key: "roles.assign", label: t("Assign") },
        ]
    }
});