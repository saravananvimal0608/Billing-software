import { NavLink, useNavigate } from 'react-router-dom';
import ElectronicImg from '../../assets/electro.jpg'

const UserSideBar = ({ setToggle }) => {
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
                to="/user"
                onClick={() => setToggle(false)}
                end
                className={({ isActive }) =>
                    `color-primary-main side-bar-content d-block text-decoration-none ${isActive ? "admin-navbar-active" : ""
                    }`
                }
            >
                Home
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

export default UserSideBar