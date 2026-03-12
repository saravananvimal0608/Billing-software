import { useState } from "react"
import { toast } from 'react-toastify';
import '../css/Login.css';
import { useNavigate } from "react-router-dom";
import { commonApi } from "../common/common.js";
import Spinner from "./Spinner.jsx";

const ForgetPassword = () => {

    const [data, setData] = useState({ email: "", })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})
    const navigate = useNavigate()


    const handleError = () => {
        const errorMessage = {}

        if (!data.email) {
            errorMessage.email = 'email is required'
        }
        setError(errorMessage)

        return Object.keys(errorMessage).length === 0

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
            const res = await commonApi({ method: "POST", endpoint: "api/users/forgotmail", data })


            navigate('/resetpassword')

            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Forgot Password</h2>
                    <p className="login-subtitle">Please Enter your Email Id</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className={` ${error.email ? "border-danger" : ''}`}>Enter Email</label>
                            <input type="email" className={`form-input ${error.email ? "border-danger" : ''}`} name="email" value={data.email} onChange={handleChange} placeholder="Your email" required />
                            {error.email ? <p className="text-danger mt-2">{error.email}</p> : ""}
                        </div>

                        <button
                            type="submit"
                            className={data.email ? "login-btn" : "disable-btn"}
                            disabled={!data.email}
                        >
                            Send Otp
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword