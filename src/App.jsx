import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { lazy, Suspense, useState } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import "react-loading-skeleton/dist/skeleton.css";
import "./css/SuperAdmin.css";
import Spinner from "./components/Spinner";
const Login = lazy(() => import("./components/Login"));
const AdminMain = lazy(() => import("./components/admin/AdminMain"));
const Dashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AddUser = lazy(() => import("./components/admin/AddUser"));
const AddCategory = lazy(() => import("./components/admin/AddCategory"));
const AddProduct = lazy(() => import("./components/admin/AddProduct"));
const AllCategories = lazy(() => import("./components/admin/AllCategories"));
const AllProduct = lazy(() => import("./components/admin/AllProduct"));
const AllUser = lazy(() => import("./components/admin/AllUser"));
const ForgetPassword = lazy(() => import("./components/ForgetPassword"));
const Main = lazy(() => import("./components/user/Main"));
const Home = lazy(() => import("./components/user/Home"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const OrderHistory = lazy(() => import("./components/admin/OrderHistory"));
const HelpUs = lazy(() => import("./components/admin/HelpUs"));
const ViewReport = lazy(() => import("./common/CommonViewReport"));
const Upgrade = lazy(() => import("./components/admin/Upgrade"));
const SuperAdminMain = lazy(() => import("./components/superAdmin/superAdminMain"));
const SuperAdminDashboard = lazy(() => import("./components/superAdmin/Dashboard"));
const AllShops = lazy(() => import("./components/superAdmin/AllShops"));
const AddShops = lazy(() => import("./components/superAdmin/AddShops"));
const ViewPlans = lazy(() => import("./components/superAdmin/ViewPlans"));
const PaymentHistory = lazy(() => import("./components/superAdmin/PaymentHistory"));
const OtpBox = lazy(() => import("./common/OtpBox"));

const App = () => {
  const [toggleColor, setColorToggle] = useState(false);

  return (
    <div>
      <BrowserRouter>
      <Suspense fallback={<Spinner fullScreen={true}/>}>
        <Routes>
          {/*  common routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgetPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/verify-otp/:email" element={<OtpBox />} />
          <Route path="/add-shop" element={<AddShops />} />
          
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
            <Route path="payment-history" element={<PaymentHistory />} />
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
        </Suspense>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
};

export default App;
