import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Logout from '../../common/logout';
import logo from '../../assets/cotechies-logo.jpeg'
import { useEffect } from 'react';
import { fetDetails } from '../../slice/shopSlice';


const UserSideBar = ({ setToggle }) => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state?.fetchDetails?.data?.data?.data)

    useEffect(() => {
        dispatch(fetDetails())
    }, [])
    return (
        <div className=' admin-side-bar-wrapper bg-primary-main'>
            <div>

                <div className=' p-3'>
                    <div className=' text-center p-2 text-white shop-title d-flex align-items-center'>
                        <img src={logo} alt="logo" className='admin-logo' width={50} height={50} />
                        <h6 className='m-0'><b>{details?.shopName}</b></h6>
                    </div>
                </div>
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