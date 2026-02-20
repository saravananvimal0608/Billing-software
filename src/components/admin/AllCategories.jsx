import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from "react-icons/md";
import Popup from '../Popup';

const AllCategories = () => {

    const [Categories, setCategories] = useState([])
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState("")

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const categoriesPerPage = 5

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token")

    const handleFetchCategories = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/category/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCategories(res.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${baseUrl}api/category/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Category Deleted Successfully")
            handleFetchCategories()
            setTogglePopup(false)
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
        handleFetchCategories();
    }, [])

    // ✅ Pagination Logic
    const indexOfLastCategory = currentPage * categoriesPerPage
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
    const currentCategories = Categories.slice(indexOfFirstCategory, indexOfLastCategory)
    const totalPages = Math.ceil(Categories.length / categoriesPerPage)

    return (
        <div className='w-100 '>

            {togglePopup &&
                <Popup
                    setTogglePopup={setTogglePopup}
                    name={popupData?.categoryName}
                    handleDelete={handleDelete}
                />
            }

            <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                <h1 className='my-5 login-title'>All Categories</h1>

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
                                        <MdEdit
                                            size={20}
                                            className="action-icon"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ✅ Bootstrap Pagination */}
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

export default AllCategories
