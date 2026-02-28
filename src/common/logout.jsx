import { useNavigate } from "react-router-dom";


const Logout = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (token) {
            localStorage.removeItem("token");
        }
        navigate("/");
    }

    return (
        <p
            className="color-primary-main side-bar-content"
            onClick={() => handleLogout()}
        >
            Logout
        </p>

    )
}

export default Logout