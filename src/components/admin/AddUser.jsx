import { useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { commonApi } from "../../common/common.js";
import Spinner from "../Spinner.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUser = () => {

    const [data, setData] = useState({ email: "", password: '' })
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(false)

    const handleError = () => {
        const errorMessages = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email.trim()) {
            errorMessages.email = "Email is required";
        } else if (!emailRegex.test(data.email)) {
            errorMessages.email = "Please enter a valid email address";
        }

        if (!data.password.trim()) {
            errorMessages.password = "Password is required";
        } else if (data.password.length < 8) {
            errorMessages.password = "Password must be at least 8 characters long";
        }

        setError(errorMessages)

        return Object.keys(errorMessages).length === 0
    }


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!handleError()) {
            return
        }
        try {
            setLoading(true)
            const res = await commonApi({ method: "POST", endpoint: "api/users/create/salesman", data })
            setLoading(false)
            toast.success(res.data.message);
            setData({ email: "", password: '' })
        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <> {loading && <Spinner fullScreen={true} />}
            <div className="common-box ">
                <div className="login-card">
                    <h2 className="login-title">Create Account</h2>
                    <p className="login-subtitle">Please fill the details to register</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className={` ${error.email ? "border-danger" : ''}`}>Enter Email</label>
                            <input type="email" className={`form-input ${error.email ? "border-danger" : ''}`} name="email" value={data.email} onChange={handleChange} placeholder="Your email" required />
                            {error.email && <p className="text-danger mt-2">{error.email}</p>}
                        </div>
                        <div className="form-group position-relative">
                            <label className={` ${error.password ? "border-danger" : ''}`}>Enter Password</label>
                            <input type={toggle ? "text" : "password"} className={`form-input ${error.password ? "border-danger" : ''}`} name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
                            <span className="position-absolute" style={{ right: "20px", top: "42px", }} onClick={() => setToggle(!toggle)} >
                                {toggle ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            {error.password && <p className="text-danger mt-2">{error.password}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={!data.email.trim() || !data.password.trim()}
                            className={data.email && data.password ? "login-btn" : "disable-btn"}
                        >
                            Register
                        </button>

                    </form>
                </div>
            </div>
        </>

    )
}

export default AddUser