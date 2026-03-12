import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdDelete, MdEdit } from "react-icons/md";
import Popup from '../DeletePopup.jsx';
import { Link } from 'react-router-dom';
import { commonApi } from '../../common/common.js';
import Skeleton from 'react-loading-skeleton'

const AllCategories = () => {

    const [categories, setCategories] = useState([])
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState(null)

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Fetch Categories
    const handleFetchCategories = async (page, search) => {
        try {

            setLoading(true)

            const res = await commonApi({
                method: "GET",
                endpoint: `api/category?page=${page}&search=${search}`
            })

            setCategories(res.data.categories)
            setTotalPages(res.data.totalPages)

        } catch (error) {

            toast.error(error.response?.data?.message || "Something went wrong")

        } finally {

            setLoading(false)

        }
    }

    const handleSelect = (id) => {

        setSelectedCategories((prev) => {

            if (prev.includes(id)) {
                return prev.filter(item => item !== id)
            } else {
                return [...prev, id]
            }

        })

    }

    const handlePopup = (item) => {

        if (Array.isArray(item)) {

            setDeleteId(item)
            setPopupData({ categoryName: `${item.length} categories` })

        } else {

            setDeleteId(item._id)
            setPopupData(item)

        }

        setTogglePopup(true)

    }

    const handleDelete = async () => {

        try {

            setLoading(true)

            if (Array.isArray(deleteId)) {

                const res = await commonApi({
                    method: "DELETE",
                    endpoint: "api/category/bulk",
                    data: { ids: deleteId }
                })

                toast.success(res.data.message)

                setSelectedCategories([])

            } else {

                const res = await commonApi({
                    method: "DELETE",
                    endpoint: `api/category/${deleteId}`
                })

                toast.success(res.data.message)

            }

            setTogglePopup(false)
            setCurrentPage(1)
            handleFetchCategories(1, searchTerm)

        } catch (error) {

            toast.error(error.response?.data?.message || "Something went wrong")

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {
        handleFetchCategories(currentPage, searchTerm)
    }, [currentPage, searchTerm])

    return (
        <>
            <div className='w-100'>

                {togglePopup &&

                    <Popup
                        setTogglePopup={setTogglePopup}
                        name={popupData?.categoryName}
                        handleDelete={handleDelete}
                    />

                }

                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>

                    <h1 className='my-5 login-title'>All Categories</h1>

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

                    {selectedCategories.length > 0 && (

                        <div className="d-flex align-items-center gap-3 mb-3">



                            <button
                                className="btn add-btn"
                                onClick={() => handlePopup(selectedCategories)}
                            >
                                {selectedCategories.length}  Delete Selected
                            </button>
                            <div className='d-flex align-items-center gap-2'>
                                <input
                                    type="checkbox"
                                    className='me-1'
                                    checked={
                                        categories.length > 0 &&
                                        selectedCategories.length === categories.length
                                    }
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            setSelectedCategories(categories.map(c => c._id))
                                        } else {
                                            setSelectedCategories([])
                                        }

                                    }}
                                />
                                <span className='fw-bold color-primary'>Select All</span>
                            </div>

                        </div>

                    )}

                    <table className="premium-table w-100">

                        <thead>
                            <tr>

                                <th>No</th>
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
                                            <Skeleton width={20} inline />{" "}
                                            <Skeleton width={20} inline />
                                        </td>
                                    </tr>

                                ))

                            ) : categories.length === 0 ? (

                                <tr>
                                    <td colSpan={3} className="text-center login-title">
                                        No data found
                                    </td>
                                </tr>

                            ) : (

                                categories.map((cat, index) => (

                                    <tr key={cat._id}>

                                        <td>
                                            <input
                                                className='me-3'
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat._id)}
                                                onChange={() => handleSelect(cat._id)}
                                            />
                                            {(currentPage - 1) * 5 + index + 1}
                                        </td>

                                        <td className='d-flex justify-content-center'>
                                            <p className="elipsis-common m-0">
                                                {cat.categoryName}
                                            </p>
                                        </td>

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

export default AllCategories