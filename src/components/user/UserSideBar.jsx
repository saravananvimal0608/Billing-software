import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from '../../common/logout';


const UserSideBar = ({ setToggle }) => {

    const shopDetails = useSelector((state) => state?.fetchDetails?.data?.data?.data)


    return (
        <div className=' admin-side-bar-wrapper bg-primary-main'>
            <div>
                <div className=' p-3'><div className='text-center text-white shop-title'><p className='m-0'><b>  {shopDetails?.shopName}</b></p> </div></div>
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

            <Logout />





        </div>
    )
}

export default UserSideBar