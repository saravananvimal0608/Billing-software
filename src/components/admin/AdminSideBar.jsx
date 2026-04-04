import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetDetails } from "../../slice/shopSlice";
import Logout from "../../common/logout";
import logo from "../../assets/cotechies-logo.jpeg";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { TbMessageReportFilled } from "react-icons/tb";
import { FaHandsHelping } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";

const AdminSideBar = ({ setToggle, toggleColor, setColorToggle }) => {
  const details = useSelector(
    (state) => state?.fetchDetails?.shopDetails?.data?.data,
  );



  const dispatch = useDispatch();
  const subscriptionPlan = localStorage.getItem("plan");
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(fetDetails());
  }, []);
  console.log(details?.subscriptionExpiry);

  const navClass = ({ isActive }) =>
    `color-primary-main side-bar-content d-flex align-items-center gap-2 text-decoration-none ${isActive ? "admin-navbar-active" : ""}`;

  return (
    <div
      className={`admin-side-bar-wrapper ${toggleColor ? "bg-secondary-main" : "bg-primary-main"} d-flex flex-column`}
    >
      {/* Logo */}
      <div className="p3 m-2">
        <div className="text-center p-2 text-white shop-title d-flex align-items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="admin-logo"
            width={50}
            height={50}
          />
          <h6
            className="m-0 fw-bold elipsis-main"
            onClick={() => setColorToggle(!toggleColor)}
          >
            {details?.shopName}
          </h6>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="d-flex flex-column flex-grow-1">
        <NavLink
          to="/admin"
          onClick={() => setToggle(false)}
          end
          className={navClass}
        >
          <BiSolidDashboard size={25} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/adduser"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <FaRegUser size={25} /> Add User
        </NavLink>

        <NavLink
          to="/admin/addcategory"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <TbCategoryPlus size={25} /> Add Category
        </NavLink>

        <NavLink
          to="/admin/addproduct"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <FaCartPlus size={25} /> Add Product
        </NavLink>

        <NavLink
          to="/admin/allcategories"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <MdCategory size={25} /> All Categories
        </NavLink>

        <NavLink
          to="/admin/allproducts"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <MdProductionQuantityLimits size={25} /> All Products
        </NavLink>

        <NavLink
          to="/admin/allusers"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <FaUsers size={25} /> All Users
        </NavLink>

        <NavLink
          to="/admin/orderhistory"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <BsCartCheck size={25} /> Order Histories
        </NavLink>

        <NavLink
          to="/admin/help-us"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <FaHandsHelping size={25} /> Help & Report Issue
        </NavLink>

        <NavLink
          to="/admin/view-report"
          onClick={() => setToggle(false)}
          className={navClass}
        >
          <TbMessageReportFilled size={25} /> View Reports
        </NavLink>

        {role === "admin" && (
          <NavLink
            to="/admin/upgrade"
            onClick={() => setToggle(false)}
            className={({ isActive }) =>
              `color-primary-main side-bar-content d-flex align-items-center gap-2 text-decoration-none upgrade-btn-side ${isActive ? "admin-navbar-active" : ""}`
            }
          >
            <FaUnlockAlt size={25} />
            {subscriptionPlan === "Basic"
              ? "Unlock Pro"
              : subscriptionPlan === "Pro"
                ? "Unlock Premium"
                : "Upgrade Plan"}
          </NavLink>
        )}
      </nav>

      <Logout />
    </div>
  );
};

export default AdminSideBar;
