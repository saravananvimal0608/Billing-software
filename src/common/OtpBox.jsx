import React, { useState } from "react";
import { commonApi } from "./common";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const OtpBox = () => {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const role = localStorage.getItem("role");
  const { email } = useParams();
  const navigate = useNavigate();
  const decodedEmail = decodeURIComponent(email);

  const handleOtp = async () => {
    try {
      const res = await commonApi({
        method: "POST",
        endpoint: "api/users/verifyotp",
        data: { otp, email: decodedEmail },
      });
      toast.success(res.data.message);
      if (role === "admin") navigate("/admin/allusers");
      else if (role === "superadmin") navigate("/superadmin/allshops");
      else{
        navigate("/")
      }
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await commonApi({
        method: "POST",
        endpoint: "api/users/resendotp",
        data: { email: decodedEmail },
      });
      toast.success(res.data.message || "OTP resent successfully");
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-box">
      <div className="otp-card">

        <div className="d-flex justify-content-end mb-2">
          <IoClose
            className="close-icon"
            size={26}
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="d-flex justify-content-center mb-3">
          <div className="icon-symbol d-flex justify-content-center align-items-center">
            <MdEmail size={24} color="#fff" />
          </div>
        </div>

        <h4>Verify OTP</h4>
        <p>A 6-digit OTP has been sent to<br /><strong>{decodedEmail}</strong></p>

        <input
          type="text"
          className="otp-input"
          value={otp}
          onChange={(e) => {
            if (/^\d{0,6}$/.test(e.target.value)) setOtp(e.target.value);
          }}
          placeholder="------"
          maxLength={6}
        />

        <button
          className={otp.length === 6 ? "login-btn" : "disable-btn"}
          disabled={otp.length !== 6}
          onClick={handleOtp}
        >
          Verify OTP
        </button>

        <p style={{ marginTop: 16, fontSize: 13, color: "#5F4A8B", opacity: 0.8 }}>
          Didn't receive it?{" "}
          <span
            onClick={!resending ? handleResend : undefined}
            style={{ fontWeight: 700, cursor: resending ? "not-allowed" : "pointer", textDecoration: "underline" }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default OtpBox;
