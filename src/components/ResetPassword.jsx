import { useState } from "react"
import { toast } from 'react-toastify';
import '../css/Login.css';
import { useNavigate } from "react-router-dom";
import { commonApi } from "../common/common.js";
import Spinner from "./Spinner.jsx";

const ResetPassword = () => {

    const [data, setData] = useState({ password: "", })
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await commonApi({ method: "POST", endpoint: `api/users/reset/${otp}`, data })

            navigate('/')

            toast.success(res.data.message)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Change Password</h2>
                    <p className="login-subtitle">Please Enter your New Password</p>


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Enter Otp</label>
                            <input
                                type="text"
                                maxLength="6"
                                className="form-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6 digit OTP"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Enter New Password</label>
                            <input type="password" className="form-input" name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
                        </div>

                        <button type="submit" className={data.password ? "login-btn" : "disable-btn"} disabled={!data.password}>Change Password</button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword