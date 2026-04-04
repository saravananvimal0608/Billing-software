import { toast } from "react-toastify";
import { commonApi } from "../../common/common";
import "../../css/Login.css";
import "../../css/updgrade.css";
import { useEffect, useState } from "react";

const Upgrade = () => {
  const [plans, setPlans] = useState([]);
  const [confirmPlan, setConfirmPlan] = useState(null);
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

  const handlePlans = async () => {
    try {
      const res = await commonApi({ endpoint: "api/plans" });
      console.log(res.data.data);
      setPlans(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    handlePlans();
  }, []);
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
        {plans.map((p) => (
          <div className="upgrade-plan-card">
            <h3 className="upgrade-plan-name">{p.planName} Plan</h3>
            <div className="upgrade-price">
              <span className="upgrade-amount">₹{p.amount}</span>
              <span className="upgrade-period"> /{p.validity}</span>
            </div>
            <ul className="upgrade-features">
              {p.benefits.map((benefit) => (
                <li>
                  <span className="upgrade-check">✔</span> {benefit}
                </li>
              ))}
            </ul>
       <button
  className={`upgrade-btn ${
    subcriptionPlan === p.planName ? "upgrade-btn-disabled" : ""
  }`}
  disabled={subcriptionPlan === p.planName}
  onClick={() => setConfirmPlan(p.planName)}
>
  {subcriptionPlan === p.planName ? "Current Plan" : p.planBtn}
</button>

{confirmPlan === p.planName && (
  <div className="confirm-box d-flex align-items-center gap-2">
    <button
      className="btn btn-success btn-sm"
      onClick={() => {
        handleUpgrade(p.planName);
        setConfirmPlan(null);
      }}
    >
      Yes
    </button>

    <button
      className="btn btn-secondary btn-sm"
      onClick={() => setConfirmPlan(null)}
    >
      No
    </button>
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upgrade;
