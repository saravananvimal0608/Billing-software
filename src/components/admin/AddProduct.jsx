import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");
    const [data, setData] = useState({ productName: "", originalPrice: "", productPrice: "", category: "" })
    const [categories, setCategories] = useState([])
    const [error, setError] = useState({})
    const navigate = useNavigate()
    const id = useParams().id


    const handleEditFetch = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            console.log(res);

            setData({
                productName: res.data.productName || "",
                originalPrice: res.data.originalPrice || "",
                productPrice: res.data.productPrice || "",
                category: res.data.category?._id || ""
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }

    }

    const handleError = () => {
        const errorMessages = {}

        if (!data.productName) {
            errorMessages.productName = "Product name is required";
        }

        if (!data.originalPrice) {
            errorMessages.originalPrice = "Original price is required";
        } else if (isNaN(data.originalPrice) || Number(data.originalPrice) <= 0) {
            errorMessages.originalPrice = "Original price must be a positive number";
        }

        if (!data.productPrice) {
            errorMessages.productPrice = "Product price is required";
        } else if (isNaN(data.productPrice) || Number(data.productPrice) <= 0) {
            errorMessages.productPrice = "Product price must be a positive number";
        }

        if (!data.category) {
            errorMessages.category = "Category is required";
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
            const res = id ? await axios.put(
                `${baseUrl}api/product/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ) : await axios.post(
                `${baseUrl}api/product/add`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(res.data.message);
            if (!id) {
                setData({ productName: "", productPrice: "", category: "" });
                navigate("/admin/allproducts");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}api/category/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (id) {
            handleEditFetch();
        }
    }, [id]);


    return (
        <div className="common-box mt-5">
            <div className="login-card">
                <h2 className="login-title">{id ? "Edit" : "Add"} Product</h2>
                <p className={`login-subtitle ${id ? "d-none" : "d-block"}`} >Create a new product</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className={` ${error.productName ? "border-danger" : ''}`}>Product Name</label>
                        <input
                            type="text"
                            className={`form-input ${error.productName ? "border-danger" : ''}`}
                            name="productName"
                            value={data.productName}
                            onChange={handleChange}
                            placeholder="Enter Product Name"
                            required
                        />
                        {error.productName && <p className="text-danger mt-2">{error.productName}</p>}
                    </div>

                    <div className="form-group">
                        <label className={` ${error.originalPrice ? "border-danger" : ''}`}>Original Price</label>
                        <input
                            type="number"
                            className={`form-input ${error.originalPrice ? "border-danger" : ''}`}
                            name="originalPrice"
                            value={data.originalPrice}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter Product Name"
                            required
                        />
                        {error.originalPrice && <p className="text-danger mt-2">{error.originalPrice}</p>}
                    </div>


                    <div className="form-group">
                        <label className={` ${error.productPrice ? "border-danger" : ''}`}>Product Price</label>
                        <input
                            type="number"
                            className={`form-input ${error.productPrice ? "border-danger" : ''}`}
                            name="productPrice"
                            value={data.productPrice}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter Product Price"
                            required
                        />
                        {error.productPrice && <p className="text-danger mt-2">{error.productPrice}</p>}
                    </div>

                    <div className="form-group">
                        <label className={` ${error.category ? "border-danger" : ''}`}>Product Category</label>
                        <select
                            className={`form-input ${error.category ? "border-danger" : ''}`}
                            name="category"
                            value={data.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                        {error.category && <p className="text-danger mt-2">{error.category}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!data.productName || !data.productPrice || !data.category}
                        className={data.productName && data.productPrice && data.category ? "login-btn" : "disable-btn"}
                    >
                        {id ? " Edit Product" : " Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct