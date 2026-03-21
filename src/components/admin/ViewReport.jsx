import React, { useEffect, useState } from "react";
import { commonApi } from "../../common/common";
import Skeleton from "react-loading-skeleton";

const ViewReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const handleFetch = async (page, search) => {
    try {
      setLoading(true);
      const res = await commonApi({
        endpoint: `api/report/?page=${page}&search=${search}`,
      });

      setTotalPages(res.data.totalPages);
      setData(res.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch(currentPage,searchTerm);
  },[currentPage, searchTerm]);

  return (
    <>
      <div className="w-100">
        <div className="order-history-header mx-1 my-4">
          <h1 className="order-history-title">All Reports</h1>
          <p className="order-history-sub">monitor all Reports</p>
        </div>

        <div className="text-center d-flex flex-column align-items-center w-100 p-3">
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
            <input
              className="w-50 input-search-box"
              type="text"
              placeholder="Search Reports..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <table className="premium-table w-100">
            <thead>
              <tr>
                <th>No</th>
                <th>Subject Name</th>
                <th>status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton width={20} />
                    </td>
                    <td>
                      <Skeleton width={150} />
                    </td>
                    <td>
                      <Skeleton width={60} />
                    </td>
                  </tr>
                ))
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center login-title">
                    No data found
                  </td>
                </tr>
              ) : (
                data?.map((d, index) => (
                  <tr key={d._id}>
                    <td>{index + 1}</td>

                    <td className="text-center">
                      <span className="elipsis-common" title={d.subject}>
                        {d.subject}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        className={`status-badge ${
                          d.status === "resolved"
                            ? "status-resolved"
                            : "status-pending"
                        }`}
                      >
                        {d.status}
                      </span>
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
    </>
  );
};

export default ViewReport;
