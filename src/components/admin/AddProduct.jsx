import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useNavigate } from "react-router-dom";

const AddProduct = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");
    const [data, setData] = useState({ productName: "", productPrice: "", category: "" })
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {


            await axios.post(
                `${baseUrl}api/product/add`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Product Added Successfully");
            setData({ productName: "", productPrice: "", category: "" });
            navigate("/admin/allproducts");
        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }

        }

    }



    useEffect(() => {
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
        fetchCategories();
    }, [baseUrl, token]);

    return (
        <div className="common-box mt-5">
            <div className="login-card">
                <h2 className="login-title">Add Product</h2>
                <p className="login-subtitle">Create a new product category</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            className="form-input"
                            name="productName"
                            value={data.productName}
                            onChange={handleChange}
                            placeholder="Enter Product Name"
                            required
                        />
                        <label>Product Price</label>
                        <input
                            type="number"
                            className="form-input"
                            name="productPrice"
                            value={data.productPrice}
                            onChange={handleChange}
                            placeholder="Enter Product Price"
                            required
                        />
                        <label>Product Category</label>
                        <select
                            className="form-input"
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

                    </div>

                    <button
                        type="submit"
                        disabled={!data.productName.trim() || !data.productPrice.trim() || !data.category}
                        className={data.productName.trim() && data.productPrice.trim() ? "login-btn" : "disable-btn"}
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct