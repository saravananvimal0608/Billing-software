import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';

const AddUser = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState({ name: "", password: '' })


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${baseUrl}api/users/create`, data)
            toast.success("Register Successfully")
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
                        <label>Enter Name</label>
                        <input type="text" className="form-input" name="name" value={data.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                        <label>Enter Password</label>
                        <input type="password" className="form-input" name="password" value={data.password} onChange={handleChange} placeholder="Your password" required />
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