import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { commonApi } from '../../common/common.js'
import Spinner from '../Spinner.jsx'
import { IoClose } from "react-icons/io5";


const OrderHistory = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 5

    const handleFetch = async () => {
        try {
            setLoading(true)
            const res = await commonApi({ method: "GET", endpoint: "api/order/" })
            setHistory(res.data.data)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        handleFetch()
    }, [])



    const totalPages = Math.ceil(history.length / productsPerPage)
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage

    const indexOfLastProduct = safeCurrentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = history.slice(indexOfFirstProduct, indexOfLastProduct)




    console.log(history);



    return (
        <>
            {loading && <Spinner fullScreen={true} />}
            <div className='w-100'>


                <div className='text-center d-flex flex-column align-items-center w-100 p-3'>
                    <h1 className='my-5 login-title'>Order History</h1>


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
                            {currentProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center login-title">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                currentProducts.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{indexOfFirstProduct + index + 1}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex flex-column gap-2 align-items-center">
                                                {item.products.map((p, i) => (
                                                    <div
                                                        key={i}
                                                        className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                                                        style={{ border: "1px solid #e0e0e0", minWidth: "200px" }}
                                                    >
                                                        <span className="flex-grow-1" style={{ fontWeight: 500 }}>
                                                            {p.productId?.productName}
                                                        </span>
                                                        <IoClose className="x-icon" size={25} />
                                                        <span style={{ fontWeight: 600, minWidth: "30px", textAlign: "center" }}>
                                                            {p.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
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

export default OrderHistory
