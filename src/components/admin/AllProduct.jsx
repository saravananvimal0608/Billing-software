import { useEffect, useState } from 'react'
import Popup from '../DeletePopup.jsx'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { commonApi } from '../../common/common.js'
import Skeleton from 'react-loading-skeleton'


const AllProduct = () => {
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const handleFetch = async (page, search) => {
        try {
            setLoading(true)

            const res = await commonApi({
                method: "GET",
                endpoint: `api/product?page=${page}&search=${search}`
            })

            setProducts(res.data.products)
            setTotalPages(res.data.totalPages)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const handleSelect = (id) => {

        setSelectedProducts((prev) => {

            if (prev.includes(id)) {
                return prev.filter(item => item !== id)
            } else {
                return [...prev, id]
            }

        })

    }

    const handleDelete = async () => {

        try {

            setLoading(true)

            if (Array.isArray(deleteId)) {

                // bulk delete

                const res = await commonApi({
                    method: "DELETE",
                    endpoint: "api/product/bulk",
                    data: { ids: deleteId }
                })

                toast.success(res.data.message)

                setSelectedProducts([])

            } else {

                // single delete

                const res = await commonApi({
                    method: "DELETE",
                    endpoint: `api/product/${deleteId}`
                })

                toast.success(res.data.message)

            }

            setTogglePopup(false)
            handleFetch(1, searchTerm)

        } catch (error) {

            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {

            setLoading(false)

        }

    }

    const handlePopup = (item) => {

        if (Array.isArray(item)) {

            // bulk delete
            setDeleteId(item)
            setPopupData({ productName: `${item.length} products` })

        } else {

            // single delete
            setDeleteId(item._id)
            setPopupData(item)

        }

        setTogglePopup(true)

    }



    useEffect(() => {
        handleFetch(currentPage, searchTerm)
    }, [currentPage, searchTerm])


    return (
        <>
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

                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
                        <input
                            className='w-50 input-search-box '
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

                    {selectedProducts.length > 0 && (

                        <div className="d-flex align-items-center gap-3 mb-3">



                            <button
                                className="btn add-btn"
                                onClick={() => handlePopup(selectedProducts)}
                            >
                                {selectedProducts.length}     Delete
                            </button>
                            <div className='d-flex align-items-center gap-2'>
                                <input
                                    type="checkbox"
                                    className='me-1'
                                    checked={
                                        products.length > 0 &&
                                        selectedProducts.length === products.length
                                    }
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            setSelectedProducts(products.map(p => p._id))
                                        } else {
                                            setSelectedProducts([])
                                        }

                                    }}
                                />
                                <span className='fw-bold color-primary'>Select All</span>
                            </div>

                        </div>

                    )}

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
                            {loading ? (
                                [...Array(4)].map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton width={20} /></td>
                                        <td><Skeleton width={120} /></td>
                                        <td>
                                            <Skeleton width={20} inline />{""}
                                            <Skeleton width={20} inline />
                                        </td>
                                    </tr>
                                ))) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center login-title">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (products.map((item, index) => (
                                    <tr key={item._id}>

                                        <td>
                                            <input
                                                className='me-3'
                                                type="checkbox"
                                                checked={selectedProducts.includes(item._id)}
                                                onChange={() => handleSelect(item._id)}
                                            />
                                            {(currentPage - 1) * 5 + index + 1}
                                        </td>
                                        <td className='d-flex justify-content-center'>
                                            <p className='elipsis-common m-0'>{item.productName ? item.productName : '----'}</p>
                                        </td>
                                        <td>{item.productPrice ? item.productPrice : "----"}</td>
                                        <td className='d-flex justify-content-center'> <p className='elipsis-common m-0'>{item.category?.categoryName ? item.category?.categoryName : '----'}</p></td>
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
                                )
                                )
                            )
                            }
                        </tbody>
                    </table>

                    {products.length > 0 && totalPages > 1 && (
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
            </div>
        </>
    )
}

export default AllProduct
