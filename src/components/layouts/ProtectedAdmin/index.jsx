import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedAdmin = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" />;
    }

    let payload;
    try {
        payload = jwtDecode(token);
    } catch {
        return <Navigate to="/" />;
    }

    const role = payload?.role;
    const isAdmin = role === 1;
    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedAdmin;
