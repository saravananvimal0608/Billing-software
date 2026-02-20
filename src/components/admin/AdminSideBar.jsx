import { NavLink, useNavigate } from 'react-router-dom';
import ElectronicImg from '../../assets/electro.jpg'

const AdminSideBar = ({ setToggle }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (token) {
            localStorage.removeItem("token");
        }
        navigate("/");
    }
    return (
        <div className=' admin-side-bar-wrapper bg-primary-main'>
            <div>
                <div className=' p-3'><div className='d-flex justify-content-around align-items-center text-white shop-title'><img src={ElectronicImg} className='electro-img' /><p className='m-0'><b>  Ramji Electronic</b></p> </div></div>
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
            <p
                className="color-primary-main side-bar-content"

                onClick={handleLogout}
            >
                Logout
            </p>





        </div>
    )
}

export default AdminSideBar