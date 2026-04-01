import React, { useEffect, useState } from "react";
import { commonApi } from "../../common/common.js"; // adjust path
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Popup states
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    validity: "",
    benefits: "",
    planBtn: "",
  });
  const [deletePopup, setDeletePopup] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Format benefits array for display
  const formatBenefits = (benefits) => {
    if (!benefits) return "—";
    if (Array.isArray(benefits)) return benefits.join(", ");
    return benefits;
  };

  // Fetch plans with search & pagination
  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await commonApi({ endpoint: "api/plans" });
      let allPlans = res?.data?.data || [];

      // Filter by search term
      if (searchTerm.trim()) {
        allPlans = allPlans.filter((p) =>
          p.planName.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Paginate
      const start = (currentPage - 1) * itemsPerPage;
      const paginated = allPlans.slice(start, start + itemsPerPage);
      setPlans(paginated);
      setTotalPages(Math.ceil(allPlans.length / itemsPerPage));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [searchTerm, currentPage]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Open add popup
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentPlanId(null);
    setFormData({
      planName: "",
      amount: "",
      validity: "",
      benefits: "",
      planBtn: "",
    });
    setShowFormPopup(true);
  };

  // Open edit popup
  const handleEditClick = (plan) => {
    setIsEditing(true);
    setCurrentPlanId(plan._id);
    setFormData({
      planName: plan.planName,
      amount: plan.amount,
      validity: plan.validity,
      benefits: Array.isArray(plan.benefits)
        ? plan.benefits.join(", ")
        : plan.benefits,
      planBtn: plan.planBtn,
    });
    setShowFormPopup(true);
  };

  // Submit add/edit
  const handleSubmit = async () => {
    try {
      // Convert benefits string to array (split by comma)
      const benefitsArray = formData.benefits
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b);

      const payload = {
        ...formData,
        benefits: benefitsArray,
        amount: Number(formData.amount),
      };

      let res;
      if (isEditing) {
        res = await commonApi({
          endpoint: `api/plans/${currentPlanId}`,
          method: "PUT",
          data: payload,
        });
        toast.success(res.data.message || "Plan updated");
      } else {
        res = await commonApi({
          endpoint: "api/plans/add",
          method: "POST",
          data: payload,
        });
        toast.success(res.data.message || "Plan created");
      }
      setShowFormPopup(false);
      fetchPlans();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  // Delete confirmation
  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await commonApi({
        endpoint: `api/plans/${planToDelete._id}`,
        method: "DELETE",
      });
      toast.success("Plan deleted successfully");
      setDeletePopup(false);
      setPlanToDelete(null);
      fetchPlans();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="w-100">
      {/* Add Plan Button */}

      {/* Header */}
      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">Subscription Plans</h1>
        <p className="order-history-sub">Manage your pricing plans</p>
      </div>

      <div className="text-center d-flex flex-column  w-100 p-3">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn add-btn" onClick={handleAddClick}>
            <MdAdd size={20} className="me-1" /> Add Plan
          </button>
        </div>
        {/* Table */}
        <div className="table-responsive w-100">
          <table className="premium-table w-100" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Plan Name</th>
                <th>Amount (₹)</th>
                <th>Validity</th>
                <th>Benefits</th>
                <th>Button Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, idx) => (
                  <tr key={idx}>
                    {[...Array(7)].map((_, i) => (
                      <td key={i}>
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center login-title">
                    No plans found
                  </td>
                </tr>
              ) : (
                plans.map((plan, index) => (
                  <tr key={plan._id}>
                    <td className="elipsis-main">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="elipsis-main">{plan.planName}</td>
                    <td className="elipsis-main">₹{plan.amount}</td>
                    <td className="elipsis-main">{plan.validity}</td>
                    <td className="elipsis-main">
                      <span
                        className="elipsis-common"
                        title={formatBenefits(plan.benefits)}
                      >
                        {formatBenefits(plan.benefits)}
                      </span>
                    </td>
                    <td>{plan.planBtn}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <MdEdit
                          size={20}
                          className="text-primary cursor-pointer"
                          onClick={() => handleEditClick(plan)}
                          style={{ cursor: "pointer" }}
                        />
                        <MdDelete
                          size={20}
                          className="text-danger cursor-pointer"
                          onClick={() => handleDeleteClick(plan)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Add/Edit Form Popup */}
      {showFormPopup && (
        <div className="otp-box">
          <div
            className="otp-card upgrade-popup"
            style={{ maxWidth: "500px", width: "90%" }}
          >
            <h4>{isEditing ? "Edit Plan" : "Add New Plan"}</h4>
            <div className="input-group-custom mt-3">
              <label>Plan Name</label>

              <select
                className="form-control"
                value={formData.planName}
                onChange={(e) =>
                  setFormData({ ...formData, planName: e.target.value })
                }
              >
                <option value="">-- Select Plan --</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="input-group-custom mt-3">
              <label>Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div className="input-group-custom mt-3">
              <label>Validity (e.g., 1 month, 1 year)</label>
              <input
                type="text"
                className="form-control"
                value={formData.validity}
                onChange={(e) =>
                  setFormData({ ...formData, validity: e.target.value })
                }
              />
            </div>
            <div className="input-group-custom mt-3">
              <label>Benefits (comma separated)</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                placeholder="e.g., 24/7 Support, Analytics Dashboard, API Access"
              />
            </div>
            <div className="input-group-custom mt-3">
              <label>Button Text (e.g., Buy Now, Subscribe)</label>
              <input
                type="text"
                className="form-control"
                value={formData.planBtn}
                onChange={(e) =>
                  setFormData({ ...formData, planBtn: e.target.value })
                }
              />
            </div>
            <div className="popup-actions mt-4">
              <button
                className="btn cancel-btn"
                onClick={() => setShowFormPopup(false)}
              >
                Cancel
              </button>
              <button className="btn confirm-btn" onClick={handleSubmit}>
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopup && (
        <div className="otp-box">
          <div className="otp-card upgrade-card">
            <h4>Confirm Delete</h4>
            <p>
              Are you sure you want to delete the plan{" "}
              <strong>{planToDelete?.planName}</strong>?
            </p>
            <div className="popup-actions">
              <button
                className="btn cancel-btn"
                onClick={() => setDeletePopup(false)}
              >
                Cancel
              </button>
              <button className="btn confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
