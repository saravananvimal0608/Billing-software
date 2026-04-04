import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Logout from '../../common/logout';
import logo from '../../assets/cotechies-logo.jpeg';
import { useEffect } from 'react';
import { fetDetails } from '../../slice/shopSlice';
import { BiSolidDashboard } from 'react-icons/bi';
import { AiOutlineLogout } from 'react-icons/ai';

const UserSideBar = ({ setToggle }) => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state?.fetchDetails?.shopDetails?.data?.data)

    useEffect(() => {
        dispatch(fetDetails())
    }, [])

   
    const navClass = ({ isActive }) =>
        `color-primary-main side-bar-content d-flex align-items-center gap-2 text-decoration-none ${isActive ? 'admin-navbar-active' : ''}`

    return (
        <div className="admin-side-bar-wrapper bg-primary-main d-flex flex-column">

            <div className="p-3">
                <div className="text-center p-2 text-white shop-title d-flex align-items-center gap-2">
                    <img src={logo} alt="logo" className="admin-logo" width={50} height={50} />
                    <h6 className="m-0 fw-bold elipsis-main">{details?.shopName}</h6>
                </div>
            </div>

            <nav className="d-flex flex-column flex-grow-1">
                <NavLink to="/user" onClick={() => setToggle(false)} end className={navClass}>
                    <BiSolidDashboard /> Home
                </NavLink>
            </nav>

                <Logout />

        </div>
    )
}

export default UserSideBar