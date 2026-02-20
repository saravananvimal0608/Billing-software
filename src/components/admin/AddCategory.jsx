import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useNavigate, useParams } from "react-router-dom";

const AddCategory = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState({ categoryName: "", })
    const [error, setError] = useState({})
    const token = localStorage.getItem("token");
    const id = useParams().id
    const navigate = useNavigate()


    const handleFetchCategoryById = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/category/single/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
             setData({ categoryName: res.data.category.categoryName })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }

       
    }

    const handleError = () => {
        const errorMessages = {}

        if (!data.categoryName.trim()) {
            errorMessages.categoryName = "Category name is required";
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
            const res = id ? await axios.put(`${baseUrl}api/category/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }) : await axios.post(`${baseUrl}api/category/add`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            toast.success(res.data.message);

            if (!id) {
                setData({ categoryName: "" });
                navigate("/admin/allcategories");
            }
        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }

        }

    }


    useEffect(() => {
        if (id) {
            handleFetchCategoryById()
        }
    }, [id])

    return (
        <div className="common-box mt-5">
            <div className="login-card">
                <h2 className="login-title">{id ? "Edit" : "Add"} Category</h2>
                <p className="login-subtitle">{id ? "Edit" : "Create a new"} product category</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className={` ${error.categoryName ? "border-danger" : ''}`}>Category Name</label>
                        <input
                            type="text"
                            className={`form-input ${error.categoryName ? "border-danger" : ''}`}
                            name="categoryName"
                            value={data.categoryName}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />
                        {error.categoryName && <p className="text-danger mt-2">{error.categoryName}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!data.categoryName}
                        className={data.categoryName ? "login-btn" : "disable-btn"}
                    >
                        {id ? "Edit Category" : "Add Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCategory