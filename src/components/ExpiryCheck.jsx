import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetDetails } from "../slice/shopSlice";
import { commonApi } from "../common/common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ExpiryCheck = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const details = useSelector(
    (state) => state?.fetchDetails?.shopDetails?.data?.data,
  );

  useEffect(() => {
    dispatch(fetDetails());
  }, [dispatch]);

  useEffect(() => {
    if (details?.subscriptionPlan) {
      localStorage.setItem("plan", details.subscriptionPlan);
    }
  }, [details]);

  const getExpiryData = () => {
    if (!details?.subscriptionExpiry) return null;

    const today = new Date();
    const expiry = new Date(details.subscriptionExpiry);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 5 && diffDays >= 0) {
      return { days: diffDays };
    } else {
      return null;
    }
  };

  const handleSamePlan = async () => {
    try {
      const res = await commonApi({
        endpoint: "api/shop/",
        method: "POST",
        data: {
          upgradePlanName: details?.subscriptionPlan,
          upgradeStatus: false,
          stayCurrentPlan: true,
        },
      });
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setOpen(false);
    }
  };

  const data = getExpiryData();
  if (!data) return null;

  const handleNavigate = () => {
    setOpen(false);
    navigate("/admin/upgrade");
  };

  return (
    <>
      {/* Top Warning Bar */}
      <div
        style={{
          width: "100%",
          background: "#fff3cd",
          color: "#856404",
          borderBottom: "1px solid #ffeeba",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          position: "fixed",
          zIndex: "9999",
          fontWeight: "500",
        }}
      >
        <marquee behavior="scroll" direction="left" scrollamount="6">
          {`⚠️ Your plan will expire within ${
            data.days === 0
              ? "Today"
              : `${data.days} day${data.days > 1 ? "s" : ""}`
          }. Please!   `}
          {" "}
          <button
            onClick={() => setOpen(true)}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Renew Plan
          </button>
        </marquee>
      </div>

      {/* Popup Modal */}
      {open && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 className="color-primary">Plan Expiry Notice</h3>
            <p className="color-primary">
              Your plan is about to expire. Do you want to continue with the
              same plan or upgrade to a new one?
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="bg-primary-main text-white"
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "6px 12px",
                }}
                onClick={handleSamePlan}
              >
                Stay on Current Plan
              </button>

              <button
                className="bg-heading-gradient text-white"
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "6px 12px",
                }}
                onClick={handleNavigate}
              >
                Change Plan
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* Styles */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
};

export default ExpiryCheck;
