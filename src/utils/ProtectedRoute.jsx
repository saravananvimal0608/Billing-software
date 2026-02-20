export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/" replace />;
};
