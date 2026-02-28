import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetDetails } from '../../slice/shopSlice';
import Logout from '../../common/logout';

const AdminSideBar = ({ setToggle }) => {
    const details = useSelector((state) => state?.fetchDetails?.data?.data?.data)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetDetails())
    }, [])

    return (
        <div className=' admin-side-bar-wrapper bg-primary-main'>
            <div>
                <div className=' p-3'><div className=' text-center p-2 text-white shop-title'><h6 className='m-0'><b>{details?.shopName}</b></h6> </div></div>
            </div>
            <NavLink
                to="/admin"
                onClick={() => setToggle(false)}
                end
                className={({ isActive }) =>
                    `color-primary-main side-bar-content d-block text-decoration-none ${isActive ? "admin-navbar-active" : ""
                    }`
                }
            >
                Dashboard
            </NavLink>

            <NavLink
                to="/admin/adduser"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >

                Add User
            </NavLink>

            <NavLink
                to="/admin/addcategory"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >

                Add Category
            </NavLink>
            <NavLink
                to="/admin/addproduct"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >
                Add Product
            </NavLink>

            <NavLink
                to="/admin/allcategories"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >
                All Categories
            </NavLink>
            <NavLink
                to="/admin/allproducts"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >
                All Products
            </NavLink>
            <NavLink
                to="/admin/allusers"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >
                All Users
            </NavLink>

            <NavLink
                to="/admin/orderhistory"
                onClick={() => setToggle(false)}
                className={({ isActive }) => `color-primary-main side-bar-content d-block text-decoration-none
                  ${isActive ? 'admin-navbar-active' : ''}`
                }
            >
                Order History
            </NavLink>

            <Logout />




        </div>
    )
}

export default AdminSideBar