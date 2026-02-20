import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useNavigate } from "react-router-dom";

const AddCategory = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState({ categoryName: "", })
    const navigate = useNavigate()


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${baseUrl}api/category/add`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Category Added Successfully");
            setData({ categoryName: "" });
            navigate("/admin/allcategories");
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
                <h2 className="login-title">Add Category</h2>
                <p className="login-subtitle">Create a new product category</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Category Name</label>
                        <input
                            type="text"
                            className="form-input"
                            name="categoryName"
                            value={data.categoryName}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!data.categoryName.trim()}
                        className={data.categoryName ? "login-btn" : "disable-btn"}
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCategory