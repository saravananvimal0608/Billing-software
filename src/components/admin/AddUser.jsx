import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';

const AddUser = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState({ name: "", password: '' })

    const [error, setError] = useState({})



    const handleError = () => {
        const errorMessages = {}

        if (!data.name.trim()) {
            errorMessages.name = "Name is required";
        }

        if (!data.password.trim()) {
            errorMessages.password = "Password is required";
        }

        else
            if (data.password.length < 8) {
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
            const res = await axios.post(`${baseUrl}api/users/create`, data)
            toast.success(res.data.message);
            setData({ name: "", password: '' })
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }

    }




    return (
        <div className="common-box mt-5">
            <div className="login-card">
                <h2 className="login-title">Create Account</h2>
                <p className="login-subtitle">Please fill the details to register</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className={` ${error.name ? "border-danger" : ''}`}>Enter Name</label>
                        <input type="text" className={`form-input ${error.name ? "border-danger" : ''}`} name="name" value={data.name} onChange={handleChange} placeholder="Your name" required />
                        {error.name && <p className="text-danger mt-2">{error.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className={` ${error.password ? "border-danger" : ''}`}>Enter Password</label>
                        <input type="password" className={`form-input ${error.password ? "border-danger" : ''}`} name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
                        {error.password && <p className="text-danger mt-2">{error.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={!data.name.trim() || !data.password.trim()}
                        className={data.name && data.password ? "login-btn" : "disable-btn"}
                    >
                        Register
                    </button>

                </form>
            </div>
        </div>
    )
}

export default AddUser