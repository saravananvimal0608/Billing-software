import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { commonApi } from "../../common/common.js";
import { IoClose } from "react-icons/io5";
import "../../css/Popup.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from "react-loading-skeleton";
import { downloadExcel, downloadPDF } from "../../utils/downloads.js";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadbtn, setDownloadbtn] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [allPaymentMode, setAllPaymentMode] = useState([]);

  const navigate = useNavigate();

  //  get plan from localStorage
  const plan = localStorage.getItem("plan");

  //  calculate min date based on plan
  const getMinDate = () => {
    const today = new Date();

    if (plan === "Basic") {
      const d = new Date();
      d.setDate(today.getDate() - 15);
      return d;
    }

    if (plan === "Pro") {
      const d = new Date();
      d.setMonth(today.getMonth() - 3);
      return d;
    }

    if (plan === "Premium") {
      const d = new Date();
      d.setMonth(today.getMonth() - 6);
      return d;
    }

    return null;
  };

  const handleFetch = async () => {
    try {
      setLoading(true);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      let endpoint = `api/order?page=${currentPage}&limit=5`;

      if (startDate && endDate) {
        endpoint += `&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;
      }

      if (paymentMode) {
        endpoint += `&paymentMode=${paymentMode}`;
      }

      const res = await commonApi({ method: "GET", endpoint });

      setAllPaymentMode(res.data.paymentMode);
      setHistory(res.data.data || []);
      setTotalRevenue(res.data.totalRevenue || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage, startDate, endDate, paymentMode]);

  const handlePopupData = (item) => {
    setPopupOpen(true);
    setPopupData(item.products);
  };

  return (
    <>
      {popupOpen && (
        <div className="popup-overlay" onClick={() => setPopupOpen(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
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
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center p-3 rounded bg-white"
                  >
                    <span className="color-primary fw-bold">
                      {item.productId?.productName}
                    </span>

                    <div className="d-flex align-items-center gap-2">
                      <IoClose className="x-icon" size={16} />
                      <span className="color-primary fw-bold">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-100" onClick={() => setDownloadbtn(false)}>
        <div className="order-history-header mx-1 my-5 my-md-4">
          <h1 className="order-history-title">Order History</h1>
          <p className="order-history-sub">
            Track and manage all your past orders
          </p>

          {/*  plan message */}
          <p style={{ fontSize: "12px", color: "gray" }}>
            {plan === "Basic" &&
              "You can view only last 15 (D) data upgrade to pro "}
            {plan === "Pro" &&
              "You can view only last 3 (M) data upgrade to Premium "}
            {plan === "Premium" && "You can view last 6 months data"}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap px-5 mb-3">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              setCurrentPage(1);
            }}
            isClearable
            placeholderText="Select date range"
            className="form-control input-search-box cursor-pointer"
            minDate={getMinDate()} //  restrict past
            maxDate={new Date()} //  restrict future
          />

          <div className="d-flex align-items-center flex-wrap gap-3 mt-3 mt-md-0">
            <div>
              <select
                className="input-search-box px-3 py-2"
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All</option>
                {allPaymentMode.map((mode, index) => (
                  <option key={index} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="d-flex align-items-center flex-wrap gap-2 px-4 py-2 rounded"
              style={{
                background: "var(--secondary-gradient)",
                color: "#fff",
                fontSize: "14px",
              }}
            >
              <span className="fw-bold">Total :</span>
              <span className="fw-bold">₹{totalRevenue}</span>
            </div>

            <div
              className="position-relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h6
                className="download-btn pb-2 mb-0"
                onClick={() => setDownloadbtn(!downloadbtn)}
              >
                Download History
              </h6>

              <div
                className={`d-flex flex-column position-absolute ${
                  downloadbtn ? "download-btn-option" : "d-none"
                }`}
              >
                <span
                  onClick={() => downloadPDF({ startDate, endDate, navigate })}
                >
                  Download PDF
                </span>
                <span
                  onClick={() =>
                    downloadExcel({ startDate, endDate, navigate })
                  }
                >
                  Download EXCEL
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive mx-3">
          <table className="table table-striped table-hover align-middle text-center">
            <thead className="table-header">
              <tr>
                <th>No</th>
                <th>Order Date</th>
                <th>Products</th>
                <th>Payment Mode</th>
                <th>Total Price</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton width={20} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <Skeleton width={60} />
                    </td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center login-title">
                    No data found
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * 5 + index + 1}</td>

                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                    <td
                      className="text-primary fw-bold cursor-pointer"
                      onClick={() => handlePopupData(item)}
                    >
                      View Order Details
                    </td>

                    <td>
                      <span className="badge bg-secondary">
                        {item.paymentMode}
                      </span>
                    </td>

                    <td className="fw-bold text-success">₹{item.totalPrice}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
