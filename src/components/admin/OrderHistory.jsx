import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { commonApi } from '../../common/common.js'
import { IoClose } from "react-icons/io5";
import '../../css/Popup.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from 'react-loading-skeleton';
import { downloadExcel, downloadPDF } from '../../utils/downloads.js';

const OrderHistory = () => {

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [popupData, setPopupData] = useState([])
    const [popupOpen, setPopupOpen] = useState(false)
    const [dateRange, setDateRange] = useState([null, null])
    const [startDate, endDate] = dateRange
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [downloadbtn, setDownloadbtn] = useState(false)

    const handleFetch = async () => {
        try {

            setLoading(true)

            const formatDate = (date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }

            let endpoint = `api/order?page=${currentPage}&limit=5`

            if (startDate && endDate) {
                endpoint += `&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
            }

            const res = await commonApi({ method: "GET", endpoint })

            setHistory(res.data.data || [])
            setTotalRevenue(res.data.totalRevenue || 0)
            setTotalPages(res.data.totalPages || 1)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleFetch()
    }, [currentPage, startDate, endDate])


    const handlePopupData = (item) => {
        setPopupOpen(true)
        setPopupData(item.products)
    }


    return (
        <>

            {popupOpen && (
                <div className="popup-overlay">
                    <div className="popup-box">

                        <div className="popup-header">
                            <h4>Ordered Products</h4>
                            <IoClose
                                className="close-icon"
                                size={28}
                                onClick={() => setPopupOpen(false)}
                            />
                        </div>

                        <div className="popup-body">
                            <div className="d-flex flex-column gap-3">

                                {popupData.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded bg-white">

                                        <span className='color-primary fw-bold'>
                                            {item.productId?.productName}
                                        </span>

                                        <div className="d-flex align-items-center gap-2">
                                            <IoClose className="x-icon" size={16} />
                                            <span className='color-primary fw-bold'>{item.quantity}</span>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>
            )}

            <div className='w-100' onClick={() => setDownloadbtn(false)}>

                <h1 className='my-5 login-title'>Order History</h1>

                <div className="d-flex justify-content-between align-items-center flex-wrap  px-5 mb-3">

                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update)
                            setCurrentPage(1)
                        }}
                        isClearable
                        placeholderText="Select date range"
                        className="form-control input-search-box cursor-pointer"
                    />

                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">

                        <div
                            className="d-flex align-items-center flex-wrap gap-2 px-4 py-2 rounded"
                            style={{ background: "var(--secondary-gradient)", color: "#fff" }}
                        >
                            <span className='fw-bold'>Total :</span>
                            <span className='fw-bold'>₹{totalRevenue}</span>
                        </div>

                        <div
                            className="position-relative "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h6 className='download-btn pb-2 mb-0' onClick={() => setDownloadbtn(!downloadbtn)}> Download History</h6>

                            <div className={`d-flex flex-column position-absolute ${downloadbtn ? "download-btn-option" : "d-none"}`}>
                                <span onClick={() => downloadPDF({ startDate, endDate })}>Download PDF</span>
                                <span onClick={() => downloadExcel({ startDate, endDate })}>Download EXCEL</span>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>

                    <table className="premium-table w-100 all-product-table">

                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Order Date</th>
                                <th>Products</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                [...Array(5)].map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton width={20} /></td>
                                        <td><Skeleton width={100} /></td>
                                        <td><Skeleton width={120} /></td>
                                        <td><Skeleton width={60} /></td>
                                    </tr>
                                ))

                            ) : history.length === 0 ? (

                                <tr>
                                    <td colSpan={4} className="text-center login-title">
                                        No data found
                                    </td>
                                </tr>

                            ) : (

                                history.map((item, index) => (
                                    <tr key={item._id}>

                                        <td>{(currentPage - 1) * 5 + index + 1}</td>

                                        <td>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>

                                        <td
                                            className="cursor-pointer"
                                            onClick={() => handlePopupData(item)}
                                        >
                                            View Order Details
                                        </td>

                                        <td>₹{item.totalPrice}</td>

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

export default OrderHistory