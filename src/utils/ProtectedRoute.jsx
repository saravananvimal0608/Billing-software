import { Navigate } from "react-router-dom";
import { getTokenExpirationDate } from "../common/jwtVerify";
import { toast } from "react-toastify";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const tokenExpDate = getTokenExpirationDate(token);
  const currentDate = new Date();

  if (!tokenExpDate || tokenExpDate < currentDate) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.error("Session expired, please login again");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};