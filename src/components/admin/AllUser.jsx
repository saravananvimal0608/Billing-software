import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import Popup from '../DeletePopup.jsx'
import { commonApi } from '../../common/common.js'
import Spinner from '../Spinner.jsx'
import { Link } from 'react-router-dom'

const AllUser = () => {

    const [users, setUsers] = useState([])
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 5

    const handleFetch = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: "api/users/allUser" })

            setUsers(res.data.data)
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

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "DELETE", endpoint: `api/users/delete/${deleteId}` })
            setTogglePopup(false)
            await handleFetch()
            setCurrentPage(1)
            toast.success(res.data.message);
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

    const handlePopup = (item) => {
        setDeleteId(item._id)
        setPopupData(item)
        setTogglePopup(true)
    }

    const filteredUsers = users.filter(user => user.role === "salesman" &&
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )



    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage

    const indexOfLastUser = safeCurrentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    console.log(currentUsers);


    useEffect(() => {
        handleFetch()
    }, [])

    return (
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className='w-100 '>

                {togglePopup && (
                    <Popup
                        setTogglePopup={setTogglePopup}
                        name={popupData.name}
                        handleDelete={handleDelete}
                    />
                )}

                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                    <h1 className='mt-5 login-title'>All Users</h1>

                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
                        <input
                            className='w-50 input-search-box'
                            type='text'
                            placeholder='Search users...'
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <Link to="/admin/adduser" className='btn add-btn'>
                            Add User
                        </Link>
                    </div>

                    <table className="premium-table w-100">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center login-title">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <th scope="row">
                                            {indexOfFirstUser + index + 1}
                                        </th>
                                        <td>{user.email}</td>
                                        <td>
                                            <MdDelete
                                                size={20}
                                                className="me-3 action-icon"
                                                onClick={() => handlePopup(user)}
                                            />
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

export default AllUser
