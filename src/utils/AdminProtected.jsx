import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AdminProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;


    if (!role) {
        return <Navigate to="/" />;
    }

    return children;
};
