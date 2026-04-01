import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../css/Login.css";
import { commonApi } from "../../common/common.js";
import Spinner from "../Spinner.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const AddUser = () => {
  const [otp, setOtp] = useState("");
  const [otpToggle, setOtpToggle] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
const navigate = useNavigate()
  const { id } = useParams();

  const handleFetchSingleUser = async () => {
    try {
      setLoading(true);
      const res = await commonApi({ endpoint: `api/users/user/${id}` });

      const email = res.data.data.email;

      setData({ email, password: "" });

      setOriginalEmail(email);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    const errorMessages = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email.trim()) {
      errorMessages.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errorMessages.email = "Enter valid email";
    }

    if (!id) {
      if (!data.password.trim()) {
        errorMessages.password = "Password is required";
      } else if (data.password.length < 8) {
        errorMessages.password = "Min 8 characters required";
      }
    }

    setError(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleError()) return;

    try {
      setLoading(true);

      const res = id
        ? await commonApi({
            method: "PUT",
            endpoint: `api/users/updateUser/${id}`,
            data,
          })
        : await commonApi({
            method: "POST",
            endpoint: "api/users/create/salesman",
            data,
          });

      if (id) {
        // update → verify with OLD email
        setRegisteredEmail(originalEmail);
      } else {
        // register → verify with NEW email
        setRegisteredEmail(data.email);
      }

      setOtp("");
      setOtpToggle(true);

      // clear form only for register
      if (!id) {
        setData({ email: "", password: "" });
      }

      toast.success(res.data.message);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message || "Something went wrong");

      // navigating to upgrade page
      if (message?.toLowerCase().includes("upgrade")) {
        navigate("/admin/upgrade");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ OTP verify
  const handleOtp = async () => {
    try {
      const res = await commonApi({
        method: "POST",
        endpoint: "api/users/verifyotp",
        data: {
          otp,
          email: registeredEmail, // 🔥 IMPORTANT
        },
      });

      toast.success(res.data.message);

      setOtp("");
      setOtpToggle(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (id) handleFetchSingleUser();
  }, [id]);

  return (
    <div className="position-relative">
      {loading && <Spinner fullScreen={true} />}

      {/* ✅ OTP POPUP */}
      {otpToggle && (
        <div className="otp-box">
          <div className="otp-card">
            <h4>Verify OTP</h4>
            <p>
              OTP sent to <strong>{registeredEmail}</strong>
            </p>

            <input
              type="text"
              className="otp-input"
              value={otp}
              onChange={(e) => {
                if (/^\d{0,6}$/.test(e.target.value)) {
                  setOtp(e.target.value);
                }
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
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="order-history-header mx-1 my-5 my-lg-3">
        <h1 className="order-history-title">
          {id ? "Update Account" : "Create Account"}
        </h1>
        <p className="order-history-sub">
          Please fill the details to {id ? "update" : "register"}
        </p>
      </div>

      {/* FORM */}
      <div className="common-box container">
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <label className={error.email ? "border-danger" : ""}>
                Enter Email
              </label>

              <input
                type="email"
                className={`form-input ${error.email ? "border-danger" : ""}`}
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              {error.email && <p className="text-danger mt-2">{error.email}</p>}
            </div>

            {/* PASSWORD (REGISTER ONLY) */}
            {!id && (
              <div className="form-group position-relative">
                <label className={error.password ? "border-danger" : ""}>
                  Enter Password
                </label>

                <input
                  type={toggle ? "text" : "password"}
                  className={`form-input ${
                    error.password ? "border-danger" : ""
                  }`}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />

                <span
                  className="position-absolute"
                  style={{ right: "20px", top: "42px", cursor: "pointer" }}
                  onClick={() => setToggle(!toggle)}
                >
                  {toggle ? <FaEye /> : <FaEyeSlash />}
                </span>

                {error.password && (
                  <p className="text-danger mt-2">{error.password}</p>
                )}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={!data.email.trim() || (!id && !data.password.trim())}
              className={
                id
                  ? data.email.trim()
                    ? "login-btn"
                    : "disable-btn"
                  : data.email.trim() && data.password.trim()
                    ? "login-btn"
                    : "disable-btn"
              }
            >
              {id ? "Update User" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
