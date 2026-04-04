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
import { commonApi } from "../../common/common.js";
import Skeleton from "react-loading-skeleton";

const AllProduct = () => {
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
  const [image, setImage] = useState(null);
  const [viewPosterPopup, setViewPosterPopup] = useState(false);
  const [bannersList, setBannersList] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [imagePreviewPopup, setImagePreviewPopup] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [iconMenuOpen, setIconMenuOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

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
          paymentStatus,
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

  const handleBannerUpload = async () => {
    try {
      if (!image || !PlanBanner) {
        toast.error("Select image & plan");
        return;
      }

      const formData = new FormData();
      formData.append("banner", image);
      formData.append("bannerType", PlanBanner);

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
      setImage(null);
      setPlanBanner("");
      if (viewPosterPopup) {
        handleFetchBanners();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    }
  };

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
    setMenuOpenFor(null);
    setIconMenuOpen(false);
  };

  const openAddPoster = () => {
    setPosterPopup(true);
    setMenuOpenFor(null);
    setIconMenuOpen(false);
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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenFor(null);
      setIconMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  console.log("shopsData", shopsData);

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

      {/* image upload popup */}
      {posterPopup && (
        <div className="otp-box">
          <div className="otp-card upgrade-popup">
            <h4>Upload Banner</h4>
            <p>Select plan and upload banner image</p>

            <div className="input-group-custom">
              <label>Banner Type</label>
              <select
                className="select-box"
                onChange={(e) => setPlanBanner(e.target.value)}
                value={PlanBanner}
              >
                <option value="">Select Plan</option>
                <option value="All">All</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="input-group-custom">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="file-upload-box"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            {image && (
              <div className="preview-container">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="preview-image"
                />
              </div>
            )}

            <div className="popup-actions">
              <button
                className="btn cancel-btn"
                onClick={() => {
                  setPosterPopup(false);
                  setImage(null);
                  setPlanBanner("");
                }}
              >
                Cancel
              </button>
              <button className="btn confirm-btn" onClick={handleBannerUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* view banners popup */}
      {viewPosterPopup && (
        <div className="otp-box">
          <div className="otp-card" style={{ maxWidth: "600px", width: "90%" }}>
            <h4>All Banners</h4>
            <p>View and manage all uploaded banners</p>

            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {loadingBanners ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </div>
              ) : bannersList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  No banners found
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {bannersList.map((banner) => (
                    <div
                      key={banner._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        background: "#f9f9f9",
                      }}
                    >
                      <img
                        src={banner.bannerImage}
                        alt={banner.bannerType}
                        style={{
                          width: "100px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleViewImage(banner.bannerImage)}
                      />
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <strong>{banner.bannerType}</strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          ID: {banner._id}
                        </div>
                      </div>
                      <MdDelete
                        size={22}
                        color="#dc3545"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteBanner(banner._id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="popup-actions" style={{ marginTop: "20px" }}>
              <button
                className="btn cancel-btn"
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
          className="img-popup-overlay"
          onClick={() => setImagePreviewPopup(false)}
        >
          <div className="img-popup-card" onClick={(e) => e.stopPropagation()}>
            <div
              className="img-popup-close"
              onClick={() => setImagePreviewPopup(false)}
            >
              ✕
            </div>
            <img
              src={selectedBannerImage}
              alt="Preview"
              className="img-popup-image"
            />
          </div>
        </div>
      )}

      {/* upgradeStatus popup */}
      {upgradePopup && (
        <div className="otp-box">
          <div className="otp-card upgrade-card">
            <h4>Confirm Upgrade</h4>
            <div className="select-option-container">
              <label>Select Plan :</label>
              <select
                onChange={(e) => setPlan(e.target.value)}
                className="select-option"
              >
                <option value="">Choose plan</option>
                <option value={"Basic"}>Basic</option>
                <option value={"Pro"}>Pro</option>
                <option value={"Premium"}>Premium</option>
              </select>
            </div>
            <div className="select-option-container">
              <label>Payment Status :</label>
              <select
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="select-option"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="popup-actions">
              <button
                className="btn cancel-btn"
                onClick={() => setUpgradePopup(false)}
              >
                No
              </button>
              <button className="btn confirm-btn"  onClick={() => handleUpgrade()}>
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
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="table-header">
            <tr>
              <th>No</th>
              <th>Shop</th>
              <th>Address</th>
              <th>Mobile</th>
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
                  {[...Array(10)].map((_, j) => (
                    <td key={j}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            ) : shopsData.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
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
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(item.address)}
                    title="Click to copy"
                  >
                    {item.address}
                  </td>

                  <td>{item.mobileNumber}</td>
                  <td>{item.paymentStatus}</td>
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

export default AllProduct;
