import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminMain from "./components/admin/AdminMain";
import Dashboard from "./components/admin/AdminDashboard";
import AddUser from "./components/admin/AddUser";
import AddCategory from "./components/admin/AddCategory";
import AddProduct from "./components/admin/AddProduct";
import AllCategories from "./components/admin/AllCategories";
import AllProduct from "./components/admin/AllProduct";
import AllUser from "./components/admin/AllUser";
import ForgetPassword from "./components/ForgetPassword";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import Main from "./components/user/Main";
import Home from "./components/user/Home";
import ResetPassword from "./components/ResetPassword";
import OrderHistory from "./components/admin/OrderHistory";
import "react-loading-skeleton/dist/skeleton.css";
import HelpUs from "./components/admin/HelpUs";
import ViewReport from "./common/CommonViewReport";
import Upgrade from "./components/admin/Upgrade";
import SuperAdminMain from "./components/superAdmin/superAdminMain";
import SuperAdminDashboard from "./components/superAdmin/Dashboard";
import AllShops from "./components/superAdmin/AllShops";
import "./css/SuperAdmin.css";
import AddShops from "./components/superAdmin/AddShops";
import ViewPlans from "./components/superAdmin/ViewPlans";
import { useState } from "react";
import OtpBox from "./common/OtpBox";

const App = () => {
  const [toggleColor, setColorToggle] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/*  common routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgetPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/verify-otp/:email" element={<OtpBox />} />
          {/* admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMain
                  toggleColor={toggleColor}
                  setColorToggle={setColorToggle}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="edituser/:id" element={<AddUser />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="editcategory/:id" element={<AddCategory />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="editproduct/:id" element={<AddProduct />} />
            <Route path="allcategories" element={<AllCategories />} />
            <Route path="allproducts" element={<AllProduct />} />
            <Route path="allusers" element={<AllUser />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="help-us" element={<HelpUs />} />
            <Route path="view-report" element={<ViewReport />} />
            <Route path="upgrade" element={<Upgrade />} />
          </Route>

          {/* super admin routes */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminMain />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperAdminDashboard />} />
            <Route path="allshops" element={<AllShops />} />
            <Route path="shops" element={<AddShops />} />
            <Route path="view-report" element={<ViewReport />} />
            <Route path="view-plan" element={<ViewPlans />} />
          </Route>

          {/* user routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["salesman"]}>
                <Main />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
          </Route>

          <Route
            path="*"
            element={
              <div className=" w-100 vh-100 bg-color-primary ">
                <h1 className="text-center pt-5 color-primary-main ">
                  404 Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
};

export default App;
