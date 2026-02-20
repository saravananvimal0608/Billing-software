import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import Popup from '../Popup'

const AllUser = () => {

    const [users, setUsers] = useState([])
    const [togglePopup, setTogglePopup] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const [deleteId, setDeleteId] = useState("")

    // ✅ Pagination States
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 5

    const baseUrl = import.meta.env.VITE_BASE_URL

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/users/allUser`)
            setUsers(res.data.data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${baseUrl}api/users/delete/${deleteId}`)
            setTogglePopup(false)
            handleFetch()
            toast.success("User deleted successfully");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const handlePopup = (item) => {
        setDeleteId(item._id)
        setPopupData(item)
        setTogglePopup(true)
    }

    // ✅ Filter only normal users
    const filteredUsers = users.filter(user => user.role === false)

    // ✅ Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    useEffect(() => {
        handleFetch()
    }, [])

    return (

        <div className='w-100 '>

            {togglePopup && (
                <Popup
                    setTogglePopup={setTogglePopup}
                    name={popupData.name}
                    handleDelete={handleDelete}
                />
            )}

            <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                <h1 className='my-5 login-title '>All Users</h1>

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
                                    <td>{user.name}</td>
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

                {/* ✅ Pagination Buttons */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">

                        <button
                            className="btn btn-secondary me-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Prev
                        </button>

                        <span className="align-self-center">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            className="btn btn-secondary ms-2"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>
        </div>
    )
}

export default AllUser
