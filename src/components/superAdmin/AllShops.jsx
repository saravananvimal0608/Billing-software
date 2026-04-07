import { useEffect, useState } from "react";
import "../../css/Login.css";
import Popup from "../DeletePopup.jsx";
import { toast } from "react-toastify";
import {
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdAdd,
  MdVisibility,
  MdSettings,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { commonApi } from "../../common/common.js";
import Skeleton from "react-loading-skeleton";

const AllShop = () => {
  const [togglePopup, setTogglePopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [shopsData, setShopsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [upgradePopup, setUpgradePopup] = useState(false);
  const [plan, setPlan] = useState("");
  const [PlanBanner, setPlanBanner] = useState("");
  const [shopId, setShopId] = useState("");
  const [posterPopup, setPosterPopup] = useState(false);
  const [image, setImage] = useState([]);
  const [viewPosterPopup, setViewPosterPopup] = useState(false);
  const [bannersList, setBannersList] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [imagePreviewPopup, setImagePreviewPopup] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [position, setPosition] = useState("");

  // Fetch shops
  const handleFetch = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await commonApi({
        method: "GET",
        endpoint: `api/shop/getallshops?page=${page}&search=${search}`,
      });

      setShopsData(res?.data?.data || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (error) {
      console.log(error?.response?.data);

      toast.error(error?.response?.data?.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const payload = Array.isArray(deleteId)
        ? { ids: deleteId }
        : { id: deleteId };

      const res = await commonApi({
        method: "DELETE",
        endpoint: "api/shop",
        data: payload,
      });

      toast.success(res.data.message);
      setSelectedProducts([]);
      setTogglePopup(false);
      setCurrentPage(1);
      handleFetch(currentPage, searchTerm);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePopup = (item) => {
    if (Array.isArray(item)) {
      setDeleteId(item);
      setPopupData({ shopName: `${item.length} shops` });
    } else {
      setDeleteId(item._id);
      setPopupData(item);
    }
    setTogglePopup(true);
  };

  const handleUpgradePopup = (id) => {
    setUpgradePopup(true);
    setShopId(id);
    setPlan("");
  };

  const handleUpgrade = async (id) => {
    try {
      const finalId = id || shopId;

      if (!finalId) {
        toast.error("Shop ID missing ❌");
        return;
      }

      const res = await commonApi({
        endpoint: "api/shop/approve",
        method: "POST",
        data: {
          shopId: finalId,
          plan,
        },
      });

      setUpgradePopup(false);
      toast.success(res.data.message);
      handleFetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Upgrade failed");
    }
  };

  // Multiple Banner Upload
  const handleBannerUpload = async () => {
    try {
      if (!image || image.length === 0 || !PlanBanner || !position) {
        toast.error("Select images & plan & positions");
        return;
      }

      const formData = new FormData();

      image.forEach((imgFile) => {
        formData.append("banner", imgFile); // must match backend field
      });

      formData.append("bannerType", PlanBanner);
      formData.append("position", position);

      const res = await commonApi({
        method: "POST",
        endpoint: "api/banner",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setPosterPopup(false);
      setImage([]);
      setPlanBanner("");
      setPosition("");

      if (viewPosterPopup) {
        handleFetchBanners();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    }
  };

  // Fetch all banners
  const handleFetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const res = await commonApi({
        method: "GET",
        endpoint: "api/banner/getAll",
      });
      setBannersList(res?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch banners");
    } finally {
      setLoadingBanners(false);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const res = await commonApi({
        method: "DELETE",
        endpoint: `api/banner/${bannerId}`,
      });
      toast.success(res.data.message);
      handleFetchBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const openViewPosters = () => {
    setViewPosterPopup(true);
    handleFetchBanners();
  };

  const openAddPoster = () => {
    setPosterPopup(true);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedBannerImage(imageUrl);
    setImagePreviewPopup(true);
  };

  useEffect(() => {
    handleFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Text Copied ✅");
  };

  const paymentChange = async (item, status) => {
    setPaymentStatusMap((prev) => ({ ...prev, [item._id]: status }));
    try {
      const res = await commonApi({
        endpoint: "api/payment",
        method: "POST",
        data: {
          shopId: item._id,
          plan: item.subscriptionPlan,
          paymentStatus: status,
          startDate: item.subscriptionStartDate,
          expiryDate: item.subscriptionExpiry,
        },
      });
      toast.success(res.data.message || "Payment updated");
      handleFetch(currentPage, searchTerm);
    } catch (error) {
      setPaymentStatusMap((prev) => ({
        ...prev,
        [item._id]: item.paymentStatus,
      }));
      toast.error(error?.response?.data?.message || "Payment update failed");
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {};
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="container-fluid px-4">
      {/* delete popup */}
      {togglePopup && (
        <Popup
          setTogglePopup={setTogglePopup}
          name={popupData?.shopName}
          handleDelete={handleDelete}
        />
      )}

      {/* poster upload popup */}
      {posterPopup && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: 480, width: "90%" }}>
            <div className="popup-header">
              <h4>Upload Banner</h4>
              <IoClose
                className="close-icon"
                size={28}
                onClick={() => {
                  setPosterPopup(false);
                  setImage([]);
                  setPlanBanner("");
                }}
              />
            </div>

            <div className="popup-body" style={{ height: "auto" }}>
              <div className="form-group">
                <label>Banner Type</label>
                <select
                  className="form-input"
                  style={{ cursor: "pointer" }}
                  value={PlanBanner}
                  onChange={(e) => setPlanBanner(e.target.value)}
                >
                  <option value="">Select Plan</option>
                  <option value="All">All</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="form-group">
                <label>Banner Position</label>
                <select
                  className="form-input"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="">Select Position</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div className="form-group">
                <label>Upload Images</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="form-input"
                  style={{ padding: "10px" }}
                  multiple
                  onChange={(e) => setImage([...e.target.files])}
                />
              </div>

              {image.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {image.map((imgFile, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(imgFile)}
                      alt={`preview-${index}`}
                      style={{
                        width: 70,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="popup-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setPosterPopup(false);
                  setImage([]);
                  setPlanBanner("");
                }}
              >
                Cancel
              </button>
              <button
                className="login-btn"
                style={{ width: "auto", padding: "12px 28px" }}
                onClick={handleBannerUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* view banners popup */}
      {viewPosterPopup && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: 560, width: "90%" }}>
            <div className="popup-header">
              <h4>All Banners</h4>
              <IoClose
                className="close-icon"
                size={28}
                onClick={() => {
                  setViewPosterPopup(false);
                  setBannersList([]);
                }}
              />
            </div>

            <div className="popup-body" style={{ height: 340 }}>
              {loadingBanners ? (
                <div className="d-flex flex-column gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={70} borderRadius={10} />
                  ))}
                </div>
              ) : bannersList.length === 0 ? (
                <p className="text-center login-title mt-3">No banners found</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {bannersList.map((banner) => (
                    <div
                      key={banner._id}
                      className="d-flex align-items-center gap-3 p-2 rounded"
                      style={{
                        border: "1px solid #e0e0e0",
                        background: "#f8f9fa",
                      }}
                    >
                      <img
                        src={banner.bannerImage}
                        alt={banner.bannerType}
                        style={{
                          width: 90,
                          height: 65,
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                        onClick={() => handleViewImage(banner.bannerImage)}
                      />
                      <div className="flex-grow-1 text-start">
                        <span className="status-badge status-resolved fw-bold">
                          {banner.bannerType}
                        </span>
                        <p
                          className="m-0 mt-1"
                          style={{ fontSize: 11, color: "#999" }}
                        >
                          Position: {banner.position}
                        </p>
                      </div>
                      <MdDelete
                        size={22}
                        className="action-icon"
                        style={{ color: "#d32f2f", flexShrink: 0 }}
                        onClick={() => handleDeleteBanner(banner._id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="popup-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setViewPosterPopup(false);
                  setBannersList([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* image preview popup */}
      {imagePreviewPopup && (
        <div
          className="popup-overlay"
          onClick={() => setImagePreviewPopup(false)}
        >
          <div
            className="popup-box"
            style={{
              maxWidth: 500,
              width: "90%",
              padding: 0,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h4>Banner Preview</h4>
              <IoClose
                className="close-icon"
                size={28}
                onClick={() => setImagePreviewPopup(false)}
              />
            </div>
            <img
              src={selectedBannerImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 340,
                objectFit: "contain",
                background: "#f8f9fa",
              }}
            />
          </div>
        </div>
      )}

      {/* upgradeStatus popup */}
      {upgradePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">
              <h4>Confirm Upgrade</h4>
              <IoClose
                className="close-icon"
                size={28}
                onClick={() => setUpgradePopup(false)}
              />
            </div>

            <div className="popup-body" style={{ height: "auto" }}>
              <div className="form-group">
                <label>Select Plan</label>
                <select
                  className="form-input"
                  value={plan}
                  style={{ cursor: "pointer" }}
                  onChange={(e) => setPlan(e.target.value)}
                >
                  <option value="">Choose plan</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="btn-cancel"
                onClick={() => setUpgradePopup(false)}
              >
                Cancel
              </button>
              <button
                className="login-btn"
                style={{ width: "auto", padding: "12px 28px" }}
                onClick={() => handleUpgrade()}
              >
                Yes, Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">All Shops Overview</h1>
        <p className="order-history-sub ">
          View, manage, and monitor all registered shops
        </p>
      </div>

      {/* SEARCH WITH THREE ICONS */}
      <div className="text-center d-flex justify-content-center flex-wrap gap-3 mb-3">
        <input
          className="w-50 p-2 input-search-box"
          placeholder="Search shops..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Three Icons Container */}
        <div className="d-flex gap-2 align-items-center">
          {/* Add Poster Icon */}
          <div
            className="icon-btn"
            onClick={openAddPoster}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            title="Add Poster"
          >
            <MdAdd size={22} />
          </div>

          {/* View Posters Icon */}
          <div
            className="icon-btn"
            onClick={openViewPosters}
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            title="View Posters"
          >
            <MdVisibility size={22} />
          </div>
        </div>
      </div>

      {/* BULK DELETE */}
      {selectedProducts.length > 0 && (
        <div className="d-flex align-items-center gap-3 mb-3">
          <button
            className="btn add-btn"
            onClick={() => handlePopup(selectedProducts)}
          >
            {selectedProducts.length} Delete Selected
          </button>
          <div className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="me-1"
              checked={
                shopsData.length > 0 &&
                selectedProducts.length === shopsData.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts(shopsData.map((u) => u._id));
                } else {
                  setSelectedProducts([]);
                }
              }}
            />
            <span className="fw-bold color-primary">Select All</span>
          </div>
        </div>
      )}
      {/* TABLE */}
      <div className="table-responsive">
        <table
          className="table table-striped table-hover align-middle text-center"
          style={{ minWidth: "1400px" }}
        >
          <thead className="table-header">
            <tr>
              <th>No</th>
              <th>Shop</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>$ Status</th>
              <th>Owner</th>
              <th>Plan</th>
              <th>Upgrade Request</th>
              <th>Plan Expiry In</th>
              <th>Same Plan Request</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(12)].map((_, j) => (
                    <td key={j}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            ) : shopsData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  No Shops Found
                </td>
              </tr>
            ) : (
              shopsData.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                    <span className="ms-2">
                      {(currentPage - 1) * 5 + index + 1}
                    </span>
                  </td>

                  <td>{item.shopName}</td>

                  <td
                    title={item.address}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(item.address)}
                  >
                    {item.address}
                  </td>
                  <td>{item.mobileNumber}</td>
                  <td
                    onClick={() => handleCopy(item.adminEmail)}
                    title={item.adminEmail}
                    className="cursor-pointer"
                  >
                    {item.adminEmail}
                  </td>
                  <td>
                    {item.subscriptionPlan !== "Basic" ? (
                      <select
                        className="input-search-box px-2 py-1"
                        style={{
                          background: "var(--secondary-gradient)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                        value={
                          paymentStatusMap[item._id] ??
                          item.paymentStatus ??
                          "pending"
                        }
                        onChange={(e) => paymentChange(item, e.target.value)}
                      >
                        <option style={{ background: "#1e3c48" }} value="paid">
                          Paid
                        </option>
                        <option
                          style={{ background: "#1e3c48" }}
                          value="pending"
                        >
                          Pending
                        </option>
                      </select>
                    ) : (
                      "----"
                    )}
                  </td>
                  <td>{item.ownerName}</td>
                  <td>{item.subscriptionPlan}</td>

                  <td>{item.upgradeStatus ? item.upgradePlanName : "----"}</td>
                  <td>
                    {item.subscriptionExpiry ? (
                      <span
                        title={new Date(
                          item.subscriptionExpiry,
                        ).toLocaleString()}
                        style={{
                          color:
                            Math.ceil(
                              (new Date(item.subscriptionExpiry) - new Date()) /
                                (1000 * 60 * 60 * 24),
                            ) < 0
                              ? "red"
                              : "green",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {Math.ceil(
                          (new Date(item.subscriptionExpiry) - new Date()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    ) : (
                      <span className="text-muted">---</span>
                    )}
                  </td>
                  <td>
                    {item.stayCurrentPlan ? (
                      confirmId === item._id ? (
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleUpgrade(item._id)}
                          >
                            Yes
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setConfirmId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setConfirmId(item._id)}
                        >
                          Approve
                        </button>
                      )
                    ) : (
                      "---"
                    )}
                  </td>

                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn"
                        onClick={() => handleUpgradePopup(item?._id)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn ps-0"
                        onClick={() => handlePopup(item)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      {shopsData.length > 0 && totalPages > 1 && (
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
  );
};

export default AllShop;
