export const getPermissionsData = (t) => ({
    student_management: {
        label: t("Student Management"),
        permissions: [
            { key: "students.create", label: t("add") },
            { key: "students.update", label: t("update") },
            { key: "students.delete", label: t("delete") },
        ]
    },
    group_management: {
        label: t("Group Management"),
        permissions: [
            { key: "groups.create", label: t("add") },
            { key: "groups.update", label: t("update") },
            { key: "groups.delete", label: t("delete") },
            { key: "groups.addStudents", label: t("add_student_to_group") },
            { key: "groups.deleteStudents", label: t("remove_student_from_group") },
        ]
    },
    session_management: {
        label: t("Session Management"),
        permissions: [
            { key: "sessions.create", label: t("add") },
            { key: "sessions.update", label: t("update") },
            { key: "sessions.delete", label: t("delete") },
            { key: "sessions.finish", label: t("finish") },
            { key: "sessions.google", label: t("sync_google_calendar") },
            { key: "sessions.microsoft", label: t("sync_microsoft_calendar") },
        ]
    },
    attendance_management: {
        label: t("Attendance Management"),
        permissions: [
            { key: "attendances.create", label: t("add") },
            { key: "attendances.upload", label: t("upload") },
        ]
    },
    certificate_management: {
        label: t("Certificate Management"),
        permissions: [
            { key: "certificates.create", label: t("add") },
            { key: "certificates.download", label: t("download") },
        ]
    },
    group_and_certificate_register: {
        label: t("Group and Certificate Register"),
        permissions: []
    },
    role_management: {
        label: t("Role Management"),
        permissions: [
            { key: "roles.create", label: t("add") },
            { key: "roles.assign", label: t("assign") },
        ]
    }
});