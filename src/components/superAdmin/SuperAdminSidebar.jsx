import { NavLink } from "react-router-dom";
import Logout from "../../common/logout";
import logo from "../../assets/cotechies-logo.jpeg";
import { BiSolidDashboard } from "react-icons/bi";
import { TbCategoryPlus } from "react-icons/tb";
import { TbMessageReportFilled } from "react-icons/tb";
import { FaStore } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { MdPayment } from "react-icons/md";


const SuperAdminSidebar = ({ setToggle }) => {

  const navClass = ({ isActive }) =>
    `color-primary-main side-bar-content d-flex align-items-center gap-2 text-decoration-none ${isActive ? "admin-navbar-active" : ""}`;

  return (
    <div className="admin-side-bar-wrapper bg-primary-main d-flex flex-column">

      {/* Logo */}
      <div className="p-3">
        <div className="text-center p-2 text-white shop-title d-flex align-items-center gap-2">
          <img src={logo} alt="logo" className="admin-logo" width={50} height={50} />
          <h6 className="m-0 fw-bold">Super Admin</h6>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="d-flex flex-column flex-grow-1">
        <NavLink to="/superadmin" onClick={() => setToggle(false)} end className={navClass}>
          <BiSolidDashboard size={25}/> Dashboard
        </NavLink>

        <NavLink to="/superadmin/allshops" onClick={() => setToggle(false)} className={navClass}>
          <FaStore size={25}/> All Shops
        </NavLink>

        <NavLink to="/superadmin/shops" onClick={() => setToggle(false)} className={navClass}>
          <TbCategoryPlus size={25}/> Add Shops
        </NavLink>

        <NavLink to="/superadmin/view-report" onClick={() => setToggle(false)} className={navClass}>
          <TbMessageReportFilled size={25}/> View Report
        </NavLink>

          <NavLink to="/superadmin/view-plan" onClick={() => setToggle(false)} className={navClass}>
          <GiUpgrade size={25}/> View Plans
        </NavLink>

        <NavLink to="/superadmin/payment-history" onClick={() => setToggle(false)} className={navClass}>
          <MdPayment size={25}/> Payment History
        </NavLink>


       
      </nav>

        <Logout />
    </div>
  );
};

export default SuperAdminSidebar;
