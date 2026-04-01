import { useEffect } from "react";
import { GiShop } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdWorkspacePremium } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { RiEmotionNormalLine } from "react-icons/ri";
import ApexChart from "../../common/ApexChart";
import ApexLine from "../../common/ApexLine";
import { fetchAllShops } from "../../slice/shopSlice";
import { fetchUsers } from "../../slice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();

  const allShops = useSelector((state) => state?.fetchDetails?.shops);
  const allUsers = useSelector(
    (state) => state?.fetchUsers?.data?.totalUsers
  );

  useEffect(() => {
    dispatch(fetchAllShops());
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalShops = allShops?.ShopsCount || 0;
  const totalUsers = allUsers || 0;
  const basicShops = allShops?.basicShopsCount || 0;
  const proShops = allShops?.proShopsCount || 0;
  const premiumShops = allShops?.premiumShopsCount || 0;
  const upgradeCount = allShops?.upgradeCount || 0;

  return (
    <div className="w-100">
      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">Master Dashboard</h1>
        <p className="order-history-sub">
          Monitor all shops, users, and subscription insights
        </p>
      </div>

      <div className="row justify-content-evenly">
        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Total Shops</p>
            <p><b>{totalShops}</b></p>
          </div>
          <GiShop size={50} className="icon-symbol" />
        </div>

        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Total Users</p>
            <p>{totalUsers - 1}</p>
          </div>
          <FaUsers size={50} className="icon-symbol" />
        </div>

        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Upgrade Requests</p>
            <p>{upgradeCount}</p>
          </div>
          <VscGitPullRequestGoToChanges size={50} className="icon-symbol" />
        </div>
      </div>

      <div className="row justify-content-evenly">
        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Pro Shops</p>
            <p>{proShops}</p>
          </div>
          <GiProgression size={50} className="icon-symbol" />
        </div>

        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Premium Shops</p>
            <p>{premiumShops}</p>
          </div>
          <MdWorkspacePremium size={50} className="icon-symbol" />
        </div>

        <div className="col-10 col-md-3 mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Basic Shops</p>
            <p>{basicShops}</p>
          </div>
          <RiEmotionNormalLine size={50} className="icon-symbol" />
        </div>
      </div>

      <div className="row mt-1 justify-content-center gap-2">
        
        <div className="col-10 col-md-7 col-lg-5 mb-4 apex-chart-border">
          <ApexChart
            series={[totalShops, totalUsers, basicShops]}
            labels={["Total Shops", "Total Users", "Basic Shops"]}
          />
        </div>

        <div className="col-10 col-md-7 col-lg-5 mb-4 apex-chart-border">
          <ApexLine
            title="Shop Overview"
            categories={["Count"]}
            series={[
              { name: "Total Shops", data: [totalShops] },
              { name: "Users", data: [totalUsers] },
              { name: "Basic Shops", data: [basicShops] },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;