import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { commonApi } from "../../common/common.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from "react-loading-skeleton";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- Fetch ----------
  const handleFetch = async () => {
    try {
      setLoading(true);

      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      let endpoint = `api/payment?page=${currentPage}&search=${searchTerm}`;

      if (startDate && endDate) {
        endpoint += `&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;
      }

      if (status) {
        endpoint += `&status=${status}`;
      }

      const res = await commonApi({
        method: "GET",
        endpoint,
      });

      setPayments(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage, searchTerm, startDate, endDate, status]);
  
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "----";

  return (
    <div className="w-100">
      {/* HEADER */}
      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">Payment History</h1>
        <p className="order-history-sub">
          Track all shop subscription payments
        </p>
      </div>

      {/* FILTER */}
      <div className="d-flex justify-content-between flex-wrap px-4 mb-4">
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
          className="form-control input-search-box"
          maxDate={new Date()}
        />

        <div className="d-flex gap-3 flex-wrap mt-3 mt-md-0">
          <input
            type="text"
            placeholder="Search shop..."
            className="input-search-box px-3 py-2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="input-search-box px-3 py-2"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive p-3">
        <table
          className="table table-striped table-hover align-middle text-center "
          style={{ minWidth: "600px" }}
        >
          <thead className="table-header">
            <tr>
              <th>No</th>
              <th>Shop</th>
              <th>Plan</th>
               <th>Amount</th>
              <th>Status</th>
              <th>Start</th>
              <th>Expiry</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6}>No Data Found</td>
              </tr>
            ) : (
              payments.map((item, index) => (
                <tr key={item._id}>
                  <td>{(currentPage - 1) * 5 + index + 1}</td>
                  <td>{item.shopId?.shopName}</td>
                  <td>{item.plan}</td>
                  <td>{item.amount}</td>
                  <td>{item.paymentStatus}</td>
                  <td>{formatDate(item.startDate)}</td>
                  <td>{formatDate(item.expiryDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="mx-3">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
