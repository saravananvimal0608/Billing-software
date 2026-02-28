import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from "react-icons/md";
import Popup from '../DeletePopup.jsx';
import { Link } from 'react-router-dom';
import { commonApi } from '../../common/common.js';
import Spinner from '../Spinner.jsx';

const AllCategories = () => {

    const [categories, setCategories] = useState([])
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const categoriesPerPage = 5

    // ✅ Fetch Categories
    const handleFetchCategories = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: "api/category/" })
            setCategories(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // ✅ Delete Category
    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "DELETE", endpoint: `api/category/${deleteId}` })
            toast.success(res.data.message)
            await handleFetchCategories()
            setCurrentPage(1) // safe reset
            setTogglePopup(false)
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

    // Filter First
    const filteredCategories = categories.filter((cat) =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination Logic
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage

    const indexOfLastCategory = safeCurrentPage * categoriesPerPage
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)

    useEffect(() => {
        handleFetchCategories()
    }, [])

    return (
        <>
            {loading && <Spinner fullScreen={true} />}

            <div className='w-100'>
                {togglePopup &&
                    <Popup
                        setTogglePopup={setTogglePopup}
                        name={popupData?.categoryName}
                        handleDelete={handleDelete}
                    />
                }

                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                    <h1 className='mt-5 login-title'>All Categories</h1>

                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
                        <input
                            className='w-50 input-search-box'
                            type='text'
                            placeholder='Search categories...'
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <Link to="/admin/addcategory" className='btn add-btn'>
                            Add Category
                        </Link>
                    </div>

                    <table className="premium-table w-100">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center login-title">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                currentCategories.map((cat, index) => (
                                    <tr key={cat._id}>
                                        <td>{indexOfFirstCategory + index + 1}</td>
                                        <td>{cat.categoryName}</td>
                                        <td>
                                            <MdDelete
                                                size={20}
                                                className="me-3 action-icon"
                                                onClick={() => handlePopup(cat)}
                                            />
                                            <Link to={`/admin/editcategory/${cat._id}`}>
                                                <MdEdit size={20} className="edit-icon" />
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

export default AllCategories