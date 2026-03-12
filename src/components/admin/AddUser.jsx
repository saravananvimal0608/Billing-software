import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { commonApi } from "../../common/common.js";
import Spinner from "../Spinner.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";

const AddUser = () => {

    const [data, setData] = useState({ email: "", password: '' })
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(false)
    const { id } = useParams()

    const handleFetchSingleUser = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ endpoint: `api/users/user/${id}` })
            setData({ email: res.data.data.email, password: '' })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    }

    const handleError = () => {
        const errorMessages = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email.trim()) {
            errorMessages.email = "Email is required";
        } else if (!emailRegex.test(data.email)) {
            errorMessages.email = "Please enter a valid email address";
        }
        if (!id) {
            if (!data.password.trim()) {
                errorMessages.password = "Password is required";
            } else if (data.password.length < 8) {
                errorMessages.password = "Password must be at least 8 characters long";
            }
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
            const res = id ? await commonApi({ method: "PUT", endpoint: `api/users/updateUser/${id}`, data })
                : await commonApi({ method: "POST", endpoint: "api/users/create/salesman", data })
            toast.success(res.data.message);
            if (!id) {
                setData({ email: "", password: '' })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (id) {
            handleFetchSingleUser()
        }
    }, [id])

    return (
        <> {loading && <Spinner fullScreen={true} />}
            <div className="common-box container">
                <div className="login-card">
                    <h2 className="login-title">{id ? "Update Account" : "Create Account"}</h2>
                    <p className="login-subtitle">Please fill the details to {id ? "Update" : "register"}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className={` ${error.email ? "border-danger" : ''}`}>Enter Email</label>
                            <input type="email" className={`form-input ${error.email ? "border-danger" : ''}`} name="email" value={data.email} onChange={handleChange} placeholder="Your email" required />
                            {error.email && <p className="text-danger mt-2">{error.email}</p>}
                        </div>
                        {!id && <div className="form-group position-relative">
                            <label className={` ${error.password ? "border-danger" : ''}`}>Enter Password</label>
                            <input type={toggle ? "text" : "password"} className={`form-input ${error.password ? "border-danger" : ''}`} name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
                            <span className="position-absolute" style={{ right: "20px", top: "42px", }} onClick={() => setToggle(!toggle)} >
                                {toggle ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            {error.password && <p className="text-danger mt-2">{error.password}</p>}
                        </div>}
                        <button
                            type="submit"
                            disabled={!data.email.trim() || (!id && !data.password.trim())}
                            className={
                                id
                                    ? data.email.trim()
                                        ? "login-btn"
                                        : "disable-btn"
                                    : data.email.trim() && data.password.trim()
                                        ? "login-btn"
                                        : "disable-btn"
                            }
                        >
                            {id ? "Update User" : "Register"}
                        </button>

                    </form>
                </div>
            </div>
        </>

    )
}

export default AddUser