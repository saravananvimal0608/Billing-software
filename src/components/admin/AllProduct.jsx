import React, { useEffect, useState } from 'react'
import Popup from '../DeletePopup.jsx'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { commonApi } from '../../common/common.js'
import Spinner from '../Spinner.jsx'

const AllProduct = () => {
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 5

    const handleFetch = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: "api/product/" })
            setProducts(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "DELETE", endpoint: `api/product/${deleteId}` })
            toast.success(res.data.message);
            setTogglePopup(false)
            await handleFetch()
            setCurrentPage(1)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
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

    const filteredProducts = products.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage

    const indexOfLastProduct = safeCurrentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className='w-100'>

                {togglePopup &&
                    <Popup
                        setTogglePopup={setTogglePopup}
                        name={popupData?.productName}
                        handleDelete={handleDelete}
                    />
                }

                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                    <h1 className='mt-5 login-title'>All Products</h1>

                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
                        <input
                            className='w-50 input-search-box'
                            type='text'
                            placeholder='Search products...'
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <Link to="/admin/addproduct" className='btn add-btn'>
                            Add Product
                        </Link>
                    </div>

                    <table className="premium-table w-100 all-product-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Products</th>
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
                                                    className="edit-icon"
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-4">

                            <button
                                className="pagination-btn me-3"
                                disabled={safeCurrentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Prev
                            </button>

                            <span className="color-primary fw-bold">
                                Page {safeCurrentPage} of {totalPages}
                            </span>

                            <button
                                className="pagination-btn ms-3"
                                disabled={safeCurrentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default AllProduct
