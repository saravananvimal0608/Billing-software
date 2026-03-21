import { toast } from "react-toastify";
import React, { useState } from "react";
import { commonApi } from "../../common/common";
import Spinner from "../Spinner";

const HelpUs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ subject: "", description: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await commonApi({
        method: "POST",
        endpoint: "api/report/",
        data,
      });
      toast.success(res.data.message);
      setData({ description: "", subject: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner fullScreen={true} />}
        <div className="order-history-header mx-1 my-5 my-lg-3">
        <h1 className="order-history-title">Report an Issue</h1>
        <p className="order-history-sub">
          Help us improve by describing your problem in detail
        </p>
      </div>
      <div className="common-box container">
        <div className="login-card" style={{ maxWidth: 520 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-input"
                name="subject"
                value={data.subject}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                rows={5}
                required
                style={{ resize: "vertical", minHeight: 120 }}
              />
              {/* <small>max 500 characters</small> */}
            </div>

            <button
              type="submit"
              disabled={!data.description && !data.subject}
              className={
                data.description && data.subject ? "login-btn" : "disable-btn"
              }
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HelpUs;
