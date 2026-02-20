import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify';
import '../css/Login.css';
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Login = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState({ name: "", password: '' })
    const [toggle, setToggle] = useState(false)
    const navigate = useNavigate()


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${baseUrl}api/users/login`, data)

            const token = res.data.token
            localStorage.setItem("token", token)
            if (res.data.role) {
                navigate('/admin')
            }
            else {
                navigate('/user')
            }

            toast.success("Login Successfully")
        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please login to your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Enter Name</label>
                        <input type="text" className="form-input" name="name" value={data.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div className="form-group ">
                        <label>Password</label>
                        <div className="position-relative">
                            <input type={!toggle ? "password" : "text"} className="form-input" name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
                            <span className="position-absolute" style={{ right: "15px", top: "12px", }} onClick={() => setToggle(!toggle)} >
                                {toggle ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    <Link to={'/forgotPassword'} className="text-decoration-none color-primary">Forgot Password</Link>
                </form>
            </div>
        </div>
    )
}

export default Login