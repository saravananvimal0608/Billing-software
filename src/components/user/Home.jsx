import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { commonApi } from '../../common/common';
import Spinner from '../Spinner.jsx';
import { IoClose } from "react-icons/io5";
import '../../css/Popup.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {

    const [product, setProduct] = useState([])
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState([]);
    const [popup, setPopup] = useState(false)
    const [successMesage, setSuccessMessage] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const handleFetchProduct = async (page, search) => {
        try {
            setLoading(true)
            const res = await commonApi({
                method: "GET",
                endpoint: `api/product?page=${page}&search=${search}`
            })
            console.log('res', res.data);

            setProduct(res.data.products)
            setTotalPages(res.data.totalPages)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleFetchCategory = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: "api/category/withoutPagination" })
            setCategories(res.data.categories)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleFetchCategoryById = async (categoryId) => {

        setCurrentPage(1)

        if (!categoryId) {
            handleFetchProduct(1, searchTerm);
            return;
        }

        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: `api/product/category/${categoryId}` })

            setProduct(res.data.products);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    };

    //  Search Filter
    const filteredProducts = product.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // total amount calculation for frontend showing
    const totalAmount = cart.reduce((total, item) => {
        const productDetails = product.find(p => p._id === item.productId);
        return total + (productDetails?.productPrice || 0) * item.quantity;
    }, 0);


    const handleIncrease = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.productId === product._id);

            if (existing) {
                return prevCart.map(item =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    productId: product._id,
                    quantity: 1
                }];
            }
        });
    };


    const handleDecrease = (productId) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await commonApi({
                method: "POST",
                endpoint: "api/order/",
                data: { products: cart }
            });
            handleSuccessPopup(res.data.data)
            setCart([])
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    }


    const handleSuccessPopup = (data) => {
        setSuccessMessage(data.totalPrice)
        setPopup(true)
    }


    useEffect(() => {
        handleFetchCategory()
    }, [])

    useEffect(() => {
        handleFetchProduct(currentPage, searchTerm)
    }, [currentPage, searchTerm])



    return (
        <>

            {popup && (
                <div className="position-fixed top-0 start-0 w-100 d-flex justify-content-center align-items-center  vh-100 " style={{ background: "rgba(0, 0, 0, 0.6)", zIndex: 9999 }}>
                    <div className="col-12 col-md-6">
                        <div className="success-popup d-flex flex-column align-items-center p-5"><p className='m-0'>Order placed successfully!</p><p> Total Price: ₹ <b>{successMesage}</b></p>

                            <span className='success-span ' onClick={() => setPopup(false)}>Close</span>

                        </div>
                    </div>
                </div>
            )}

            {loading && <Spinner fullScreen={true} />}
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
                                {cat.categoryName.length > 20 ? cat.categoryName.slice(0, 20) + "..." : cat.categoryName}
                            </option>
                        ))}
                    </select>

                    {cart.length > 0 && (
                        <div className='d-flex gap-2 align-items-center'>
                            <span className='btn add-btn' onClick={handleSubmit}>Submit</span>
                            <span className='btn add-btn'>Total: ₹{totalAmount}</span>
                        </div>
                    )}

                </div>


                <div className="row justify-content-center">

                    {filteredProducts.length === 0 ? (
                        <p className="text-center color-primary">No products found.</p>
                    ) : (
                        filteredProducts.map((p) => (

                            <div key={p._id} className="col-10 col-md-4 col-lg-3 mb-4">
                                <div
                                    className="p-3 text-center rounded shadow text-white bg-color-primary"                            >
                                    <h5>{p.productName}</h5>
                                    <p className="mb-1"> Price : ₹ {p.productPrice}</p>
                                    <small>{p.category?.categoryName}</small>

                                    <div className='d-flex justify-content-center align-items-center mt-3 gap-2'>
                                        <button className='btn btn-sm btn-light fw-bold px-3' onClick={() => handleDecrease(p._id)}>-</button>
                                        <span>
                                            {cart.find(item => item.productId === p._id)?.quantity || 0}
                                        </span>
                                        <button className='btn btn-sm btn-light fw-bold px-3' onClick={() => handleIncrease(p)}>+</button>
                                    </div>
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
        </>
    )
}

export default Home
