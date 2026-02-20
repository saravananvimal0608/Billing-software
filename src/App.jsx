import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminProtectedRoute } from './utils/AdminProtected';
import AdminDashboard from './components/admin/AdminDashboard';
// import Product from './components/Product';
import Dashboard from './components/admin/Dashboard';
import AddUser from './components/admin/AddUser';
import AddCategory from './components/admin/AddCategory';
import AddProduct from './components/admin/AddProduct';
import AllCategories from './components/admin/AllCategories';
import AllProduct from './components/admin/AllProduct';
import AllUser from './components/admin/AllUser';
import ForgetPassword from './components/ForgetPassword';
import { ProtectedRoute } from './utils/ProtectedRoute';
import Main from './components/user/Main';
import Home from './components/user/Home';

const App = () => {
  return (
    <div>

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/forgotPassword' element={<ForgetPassword />} />

          <Route path="/admin" element={<AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='adduser' element={<AddUser />} />
            <Route path='addcategory' element={<AddCategory />} />
            <Route path='addproduct' element={<AddProduct />} />
            <Route path='allcategories' element={<AllCategories />} />
            <Route path='allproducts' element={<AllProduct />} />
            <Route path='allusers' element={<AllUser />} />
          </Route >


          <Route path='/user' element={<ProtectedRoute><Main /></ProtectedRoute>}>
            <Route index element={<Home />} />
          </Route>


          <Route path='*' element={<div className=" w-100 vh-100 bg-color-primary "><h1 className='text-center pt-5 color-primary-main '>404 Not Found</h1></div>} />
        </Routes>


      </BrowserRouter>



      <ToastContainer />
    </div>
  )
}

export default App