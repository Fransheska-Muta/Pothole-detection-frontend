import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();
    if (!user) {
        return < Navigate to="/" />;
    }
    if (roles) {
        const allowedRoles = Array.isArray(roles)? roles: [roles];
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/*" />;
        }
    }
    return children
}

export default ProtectedRoute