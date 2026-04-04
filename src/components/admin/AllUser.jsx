import { useEffect, useState } from "react";
import "../../css/Login.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Popup from "../DeletePopup.jsx";
import { commonApi } from "../../common/common.js";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [togglePopup, setTogglePopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFetch = async (page, search = "") => {
    try {
      setLoading(true);

      const res = await commonApi({
        method: "GET",
        endpoint: `api/users/allUser?page=${page}&search=${search}`,
      });

      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePopup = (item) => {
    if (Array.isArray(item)) {
      setDeleteId(item);
      setPopupData({ name: `${item.length} users` });
    } else {
      setDeleteId(item._id);
      setPopupData(item);
    }

    setTogglePopup(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (Array.isArray(deleteId)) {
        const res = await commonApi({
          method: "DELETE",
          endpoint: "api/users/bulk",
          data: { ids: deleteId },
        });

        toast.success(res.data.message);
        setSelectedUsers([]);
      } else {
        const res = await commonApi({
          method: "DELETE",
          endpoint: `api/users/delete/${deleteId}`,
        });

        toast.success(res.data.message);
      }

      setTogglePopup(false);
      setCurrentPage(1);
      handleFetch(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInactiveClick = () => {
  toast.warning("This user is inactive. Please upgrade your plan to access this user.");
  navigate("/admin/upgrade");
};

  useEffect(() => {
    handleFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);


  console.log(users,'users');
  
  
  return (
    <>
      <div className="w-100">
        {togglePopup && (
          <Popup
            setTogglePopup={setTogglePopup}
            name={popupData?.name}
            handleDelete={handleDelete}
          />
        )}
        <div className="order-history-header mx-1 my-4">
          <h1 className="order-history-title">All Users</h1>
          <p className="order-history-sub">
            Manage and monitor all registered users
          </p>
        </div>

        <div className="text-center d-flex flex-column align-items-center w-100 p-3">
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap w-100">
            <input
              className="w-50 input-search-box"
              type="text"
              placeholder="Search users..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Link to="/admin/adduser" className="btn add-btn">
              Add User
            </Link>
          </div>

          {selectedUsers.length > 0 && (
            <div className="d-flex align-items-center gap-3 mb-3">
              <button
                className="btn add-btn"
                onClick={() => handlePopup(selectedUsers)}
              >
                {selectedUsers.length} Delete Selected
              </button>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="me-1"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map((u) => u._id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
                <span className="fw-bold color-primary">Select All</span>
              </div>
            </div>
          )}

        <div className="table-responsive w-100">
  <table className="table table-striped table-hover align-middle text-center">
    
    <thead className="table-header">
      <tr>
        <th>No</th>
        <th>Email</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        [...Array(4)].map((_, index) => (
          <tr key={index}>
            <td><Skeleton width={20} /></td>
            <td><Skeleton width={150} /></td>
            <td><Skeleton width={40} /></td>
          </tr>
        ))
      ) : users.length === 0 ? (
        <tr>
          <td colSpan={3} className="text-center login-title">
            No data found
          </td>
        </tr>
      ) : (
        users.map((user, index) => (
        <tr
  key={user._id}
  className={!user.isActive ? "opacity-50" : ""}
  style={{ cursor: !user.isActive ? "pointer" : "default" }}
  onClick={() => {
    if (!user.isActive) handleInactiveClick();
  }}
>
            <td>
              <input
                className="me-3"
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleSelect(user._id)}
              />
              {(currentPage - 1) * 5 + index + 1}
            </td>

<td
  className={`elipsis-common m-0 ${
    !user.isActive ? "text-muted cursor-pointer" : ""
  }`}
  title={user.email}
  onClick={() => {
    if (!user.isActive) handleInactiveClick();
  }}
>
  {user.email}

  {!user.isActive && (
    <span className="badge bg-warning text-dark ms-2">
      Upgrade
    </span>
  )}
</td>
            <td>
              {user?.role !== "admin" && (
                <MdDelete
                  size={20}
                  className="me-3 action-icon"
                  onClick={() => handlePopup(user)}
                />
              )}

              <Link
                to={`/admin/edituser/${user._id}`}
                className="text-dark"
              >
                <MdEdit size={20} className="edit-icon" />
              </Link>
            </td>
          </tr>
        ))
      )}
    </tbody>

  </table>
</div>

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

export default AllUser;
