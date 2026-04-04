import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../css/Login.css";
import { commonApi } from "../../common/common.js";
import Spinner from "../Spinner.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const AddShops = () => {
  const navigate = useNavigate();
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [data, setData] = useState({
    shopName: "",
    ownerName: "",
    mobileNumber: "",
    address: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { id } = useParams();

  const removeDataAfterSubmit = () => {
    setData({
      shopName: "",
      ownerName: "",
      mobileNumber: "",
      address: "",
      email: "",
      password: "",
    });
  };

  const handleFetchSingleUser = async () => {
    try {
      setLoading(true);
      const res = await commonApi({ endpoint: `api/users/user/${id}` });
      setData({ email: res.data.data.email, password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    const errorMessages = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!data.shopName.trim()) errorMessages.shopName = "Shop name is required";
    if (!data.ownerName.trim())
      errorMessages.ownerName = "Owner name is required";

    if (!data.mobileNumber.trim())
      errorMessages.mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(data.mobileNumber))
      errorMessages.mobileNumber = "Enter valid 10-digit number";

    if (!data.address.trim()) errorMessages.address = "Address is required";

    if (!data.email.trim()) errorMessages.email = "Email is required";
    else if (!emailRegex.test(data.email))
      errorMessages.email = "Enter valid email";

    if (!id) {
      if (!data.password.trim())
        errorMessages.password = "Password is required";
      else if (data.password.length < 8)
        errorMessages.password = "Min 8 characters required";
    }

    setError(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setData({ ...data, [name]: value });
  };

  // 🔥 MAIN FIX HERE
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
            endpoint: "api/users/create/admin",
            data,
          });


      // ✅ clear only for register
      if (!id) {
        removeDataAfterSubmit();
      }

      toast.success(res.data.message);
      navigate(`/verify-otp/${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) handleFetchSingleUser();
  }, [id]);

  return (
    <div className="position-relative">
      {loading && <Spinner fullScreen={true} />}

      <div className="order-history-header mx-1 my-5 my-lg-3">
        <h1 className="order-history-title">
          {id ? "Update Shop" : "Create Shop"}
        </h1>
        <p className="order-history-sub">
          Please fill the details to {id ? "update" : "register"}
        </p>
      </div>

      <div className="common-box container">
        <div
          className="login-card"
          style={{ maxHeight: "450px", overflowY: "auto" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className={error.shopName ? "border-danger" : ""}>
                Shop Name
              </label>
              <input
                type="text"
                className={`form-input ${error.shopName ? "border-danger" : ""}`}
                name="shopName"
                value={data.shopName}
                onChange={handleChange}
                placeholder="Enter shop name"
              />
              {error.shopName && (
                <p className="text-danger mt-2">{error.shopName}</p>
              )}
            </div>

            <div className="form-group">
              <label className={error.ownerName ? "border-danger" : ""}>
                Owner Name
              </label>
              <input
                type="text"
                className={`form-input ${error.ownerName ? "border-danger" : ""}`}
                name="ownerName"
                value={data.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
              />
              {error.ownerName && (
                <p className="text-danger mt-2">{error.ownerName}</p>
              )}
            </div>

            <div className="form-group">
              <label className={error.mobileNumber ? "border-danger" : ""}>
                Mobile Number
              </label>
              <input
                type="number"
                className={`form-input ${error.mobileNumber ? "border-danger" : ""}`}
                name="mobileNumber"
                value={data.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {error.mobileNumber && (
                <p className="text-danger mt-2">{error.mobileNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label className={error.address ? "border-danger" : ""}>
                Address
              </label>
              <input
                type="text"
                className={`form-input ${error.address ? "border-danger" : ""}`}
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
              {error.address && (
                <p className="text-danger mt-2">{error.address}</p>
              )}
            </div>

            <div className="form-group">
              <label className={error.email ? "border-danger" : ""}>
                Email
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

            {!id && (
              <div className="form-group position-relative">
                <label className={error.password ? "border-danger" : ""}>
                  Password
                </label>

                <input
                  type={toggle ? "text" : "password"}
                  className={`form-input ${error.password ? "border-danger" : ""}`}
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

            <button
              type="submit"
              disabled={!data.email.trim() || (!id && !data.password.trim())}
              className={
                data.email.trim() && (id || data.password.trim())
                  ? "login-btn"
                  : "disable-btn"
              }
            >
              {id ? "Update Shop" : "Register Shop"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShops;
