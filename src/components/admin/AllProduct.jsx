import React, { useEffect, useState } from 'react'
import Popup from '../Popup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Link } from 'react-router-dom'

const AllProduct = () => {
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [products, setProducts] = useState([])

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 5

    const token = localStorage.getItem("token")
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/product/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProducts(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${baseUrl}api/product/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(res.data.message);
            setTogglePopup(false)
            handleFetch()
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const handlePopup = (item) => {
        setDeleteId(item._id)
        setPopupData(item)
        setTogglePopup(true)
    }

    useEffect(() => {
        handleFetch()
    }, [])

    // ✅ Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(products.length / productsPerPage)

    return (
        <div className='w-100'>

            {togglePopup &&
                <Popup
                    setTogglePopup={setTogglePopup}
                    name={popupData?.productName}
                    handleDelete={handleDelete}
                />
            }

            <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                <h1 className='my-5 login-title'>All Products</h1>

                <table className="premium-table w-100 all-product-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Products</th>
                            <th>Original Price</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center login-title">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{indexOfFirstProduct + index + 1}</td>
                                    <td>{item.productName ? item.productName : '----'}</td>
                                    <td>{item.originalPrice ? item.originalPrice : "----"}</td>
                                    <td>{item.productPrice ? item.productPrice : "----"}</td>
                                    <td>{item.category?.categoryName ? item.category?.categoryName : '----'}</td>
                                    <td>
                                        <MdDelete
                                            size={20}
                                            className="me-md-3 action-icon"
                                            onClick={() => handlePopup(item)}
                                        />
                                        <Link to={`/admin/editproduct/${item._id}`} className='text-black'>
                                        <MdEdit
                                            size={20}
                                            className="action-icon"
                                        />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ✅ Bootstrap Pagination Only */}
                {totalPages > 1 && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">

                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Previous
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </li>

                        </ul>
                    </nav>
                )}

            </div>
        </div>
    )
}

export default AllProduct
