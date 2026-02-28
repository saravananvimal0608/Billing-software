import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useNavigate, useParams } from "react-router-dom";
import { commonApi } from "../../common/common.js";
import Spinner from "../Spinner.jsx";

const AddProduct = () => {

    const [data, setData] = useState({ productName: "", productPrice: "", category: "" })
    const [categories, setCategories] = useState([])
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const id = useParams().id


    const handleEditFetch = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: `api/product/${id}` })
            console.log(res.data.product);

            setData({
                productName: res.data.product.productName || "",
                productPrice: res.data.product.productPrice || "",
                category: res.data.product.category?._id || ""
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }

    }

    const handleError = () => {
        const errorMessages = {}

        if (!data.productName) {
            errorMessages.productName = "Product name is required";
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
            setLoading(true)
            const res = id ? await commonApi({ method: "PUT", endpoint: `api/product/${id}`, data }) : await commonApi({ method: "POST", endpoint: "api/product/add", data });
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
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await commonApi({ method: "GET", endpoint: "api/category/" });
            setCategories(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false)
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
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className="common-box my-5">
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
                                    <option key={cat._id} value={cat._id} className="options">
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
        </>
    );
}

export default AddProduct