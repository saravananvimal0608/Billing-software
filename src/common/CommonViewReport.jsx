import React, { useEffect, useState } from "react";
import { commonApi } from "./common";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const ViewReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [status, setStatus] = useState("");
  const [shopId, setShopId] = useState("");
  const [id, setId] = useState("");
  const role = localStorage.getItem("role");

  // ✅ Date format function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleFetch = async (page, search) => {
    try {
      setLoading(true);

      let endpoint = "";

      if (role === "admin") {
        endpoint = `api/report/?page=${page}&search=${search}`;
      } else if (role === "superadmin") {
        endpoint = `api/report/get-all-reports/?page=${page}&search=${search}`;
      }

      if (!endpoint) return;

      const res = await commonApi({ endpoint });

      setTotalPages(res?.data?.totalPages || 1);
      setData(res?.data?.data || []);
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePopup = (status, id, shopId) => {
    setId(id);
    setShopId(shopId);

    if (status === "pending") {
      setStatus("resolved");
    } else {
      setStatus("pending");
    }
    setUpdatePopup(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await commonApi({
        endpoint: `api/report/${id}`,
        method: "PUT",
        data: { status, shopId },
      });
      toast.success(res.data.message);
      setUpdatePopup(false);
      handleFetch(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    handleFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return (
    <div className="w-100">
      {updatePopup && (
        <div className="otp-box">
          <div className="otp-card upgrade-card">
            <h4>Confirm Upgrade</h4>
            <p>Are you sure you want to upgrade this status?</p>

            <div className="popup-actions">
              <button
                className="btn cancel-btn"
                onClick={() => setUpdatePopup(false)}
              >
                No
              </button>
              <button className="btn confirm-btn" onClick={handleUpdate}>
                Yes, Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">All Reports</h1>
        <p className="order-history-sub">Monitor all Reports</p>
      </div>

      <div className="text-center d-flex flex-column align-items-center w-100 p-3">
        {/* 🔍 Search */}
        <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
          <input
            className="w-50 input-search-box p-2"
            type="text"
            placeholder="Search Reports..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

{/* 📊 Table */}
<div className="table-responsive w-100">
  <table className="table table-striped table-hover align-middle text-center">
    <thead className="table-header">
      <tr>
        <th>No</th>

        {role === "superadmin" && (
          <>
            <th>Date</th>
            <th>Shop Name</th>
            <th>Mobile</th>
          </>
        )}

        <th>Subject</th>
        <th>Description</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        [...Array(4)].map((_, index) => (
          <tr key={index}>
            {[...Array(role === "superadmin" ? 7 : 4)].map((_, i) => (
              <td key={i}>
                <Skeleton />
              </td>
            ))}
          </tr>
        ))
      ) : data.length === 0 ? (
        <tr>
          <td
            colSpan={role === "superadmin" ? 7 : 4}
            className="text-center"
          >
            No data found
          </td>
        </tr>
      ) : (
        data.map((d, index) => (
          <tr key={d._id}>
            <td>{(currentPage - 1) * 5 + index + 1}</td>

            {role === "superadmin" && (
              <>
                <td>{formatDate(d.createdAt)}</td>
                <td>{d.shopId?.shopName || "----"}</td>
                <td>{d.shopId?.mobileNumber || "----"}</td>
              </>
            )}

            <td>
              <span title={d.subject}>{d.subject}</span>
            </td>

            <td>
              <span title={d.description}>{d.description}</span>
            </td>

            <td>
              <span
                className={`badge ${
                  d.status === "resolved"
                    ? "bg-success"
                    : "bg-warning text-dark"
                } ${role === "superadmin" ? "cursor-pointer" : ""}`}
                style={{ cursor: role === "superadmin" ? "pointer" : "default" }}
                onClick={() => {
                  if (role === "superadmin") {
                    handleUpdatePopup(d.status, d._id, d.shopId?._id);
                  }
                }}
              >
                {d.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="pagination-btn me-3"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            <span className="color-primary fw-bold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="pagination-btn ms-3"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReport;
