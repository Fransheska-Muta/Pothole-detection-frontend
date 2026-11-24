// Small helpers shared by the dashboard pages (display only).

export const ROLE_LABELS = {
    user: "Citizen",
    municipality: "Municipality",
    superAdmin: "Super admin",
};

export const roleLabel = (role) => ROLE_LABELS[role] || role || "Not available";

export const initialsOf = (name) => {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return "?";
    }
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
};

// "In Progress" -> "in-progress" (used for css class names)
export const slug = (value) => (value || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

export const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
        : "N/A";