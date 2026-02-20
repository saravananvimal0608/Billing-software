import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Home = () => {

    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const [product, setProduct] = useState([])
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10

    const handleFetchProduct = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/product/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProduct(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/category/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategories(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleFetchCategoryById = async (categoryId) => {

        setCurrentPage(1) // 🔥 Reset page when filtering

        if (!categoryId) {
            handleFetchProduct();
            return;
        }

        try {
            const res = await axios.get(
                `${baseUrl}api/product/category/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setProduct(res.data.products);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // ✅ Search Filter
    const filteredProducts = product.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    useEffect(() => {
        handleFetchProduct()
        handleFetchCategory()
    }, [])

    return (
        <div className="container mt-5">

            <div className='col-12 mb-4'>
                <h1 className="text-center color-primary">All Products</h1>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">

                <input
                    type="text"
                    placeholder="Search products..."
                    className="form-control w-50"
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1) // reset page on search
                    }}
                />

                <select
                    className="form-select w-auto"
                    style={{ maxWidth: "200px" }}
                    onChange={(e) => handleFetchCategoryById(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>

            </div>


            <div className="row justify-content-center">

                {currentProducts.length === 0 ? (
                    <p className="text-center color-primary">No products found.</p>
                ) : (
                    currentProducts.map((p) => (
                        <div key={p._id} className="col-10 col-md-4 col-lg-3 mb-4">
                            <div
                                className="p-3 rounded shadow text-white bg-color-primary"                            >
                                <h5>{p.productName}</h5>
                                <p className="mb-1">₹ {p.productPrice}</p>
                                <small>{p.category?.categoryName}</small>
                            </div>
                        </div>
                    ))
                )}

            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">

                    <button
                        className="pagination-btn me-3"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Prev
                    </button>

                    <span className="color-primary fw-bold">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className="pagination-btn ms-3"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    )
}

export default Home
