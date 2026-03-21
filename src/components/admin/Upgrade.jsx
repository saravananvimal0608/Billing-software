import { toast } from "react-toastify";
import { commonApi } from "../../common/common";
import "../../css/Login.css";
import "../../css/updgrade.css";

const Upgrade = () => {
  const subcriptionPlan = localStorage.getItem("plan");

  const handleUpgrade = async (upgradePlanName) => {
    try {
      const res = await commonApi({
        endpoint: "api/shop/",
        data: { upgradePlanName, upgradeStatus: true },
        method: "POST",
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="w-100">
      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">Upgrade Your Plan</h1>
        <p className="order-history-sub">
          Choose the plan that fits your business needs
        </p>
      </div>

      <div className="upgrade-plans-container">
        {/* Basic */}
        <div className="upgrade-plan-card">
          <h3 className="upgrade-plan-name">Basic</h3>
          <div className="upgrade-price">
            <span className="upgrade-amount">₹0</span>
            <span className="upgrade-period"> / forever</span>
          </div>
          <ul className="upgrade-features">
            <li>
              <span className="upgrade-check">✔</span> 1 user only
            </li>
           
            <li>
              <span className="upgrade-check">✔</span> 15 days order history
            </li>
            <li>
  <span className="upgrade-check">✔</span> Basic support
</li>

          </ul>
          <button
            className={`upgrade-btn ${subcriptionPlan === "Basic" ? "upgrade-btn-disabled" : ""}`}
            disabled={subcriptionPlan === "Basic"}
          >
            {subcriptionPlan === "Basic" ? "Current Plan" : "Get Basic"}
          </button>
        </div>

        {/* Pro */}
        <div className="upgrade-plan-card pro-block">
          <h3 className="upgrade-plan-name">Pro</h3>
          <div className="upgrade-price">
            <span className="upgrade-amount">₹499</span>
            <span className="upgrade-period"> / per month</span>
          </div>
          <ul className="upgrade-features">
            <li>
              <span className="upgrade-check">✔</span> Up to 3 users
            </li>
            <li>
              <span className="upgrade-check">✔</span> 3 months order history
            </li>
            <li>
              <span className="upgrade-check">✔</span> Export reports (Excel
              &amp; PDF)
            </li>
            <li>
              <span className="upgrade-check">✔</span> Priority support
            </li>
          </ul>
          <button
            className={`upgrade-btn pro-btn ${subcriptionPlan === "Pro" ? "upgrade-btn-disabled" : ""}`}
            disabled={subcriptionPlan === "Pro"}
            onClick={() => handleUpgrade("Pro")}
          >
            {subcriptionPlan === "Pro" ? "Current Plan" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Premium */}
        <div className="upgrade-plan-card upgrade-plan-highlight">
          <span className="upgrade-badge">Most Popular</span>
          <h3 className="upgrade-plan-name">Premium</h3>
          <div className="upgrade-price">
            <span className="upgrade-amount">₹999</span>
            <span className="upgrade-period"> / per month</span>
          </div>
          <ul className="upgrade-features">
            <li>
              <span className="upgrade-check">✔</span> Up to 5 users
            </li>
            <li>
              <span className="upgrade-check">✔</span> 6 months order history
            </li>
            <li>
              <span className="upgrade-check">✔</span> Export reports (Excel
              &amp; PDF)
            </li>
            <li>
              <span className="upgrade-check">✔</span> Priority support
            </li>
          </ul>
          <button
            className={`upgrade-btn ${subcriptionPlan === "Premium" ? "upgrade-btn-disabled" : ""}`}
            disabled={subcriptionPlan === "Premium"}
            onClick={() => handleUpgrade("Premium")}
          >
            {subcriptionPlan === "Premium"
              ? "Current Plan"
              : "Upgrade to Premium"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
