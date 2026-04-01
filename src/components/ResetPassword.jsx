import { useState } from "react";
import { toast } from "react-toastify";
import "../css/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { commonApi } from "../common/common.js";
import Spinner from "./Spinner.jsx";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const [data, setData] = useState({ password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //  email from previous page
  const email = location.state?.email;

  // safety check
  if (!email) {
    navigate("/forgotpassword");
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }

    if (!data.password || data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await commonApi({
        method: "POST",
        endpoint: "api/users/reset-password", 
        data: {
          email,         
          otp,           
          password: data.password,
        },
      });

      toast.success(res.data.message);

      navigate("/"); // login page

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner fullScreen={true} />}

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Reset Password</h2>
          <p className="login-subtitle">
            OTP sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            
            {/* OTP */}
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                maxLength="6"
                className="form-input"
                value={otp}
                onChange={(e) => {
                  if (/^\d{0,6}$/.test(e.target.value)) {
                    setOtp(e.target.value);
                  }
                }}
                placeholder="Enter 6 digit OTP"
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Enter New Password</label>
              <div className="position-relative">
                <input
                  type={toggle ? "text" : "password"}
                  className="form-input"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />

                <span
                  className="position-absolute"
                  style={{ right: "15px", top: "12px", cursor: "pointer" }}
                  onClick={() => setToggle(!toggle)}
                >
                  {toggle ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={
                otp.length === 6 && data.password
                  ? "login-btn"
                  : "disable-btn"
              }
              disabled={otp.length !== 6 || !data.password}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;