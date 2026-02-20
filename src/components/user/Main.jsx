import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UserSideBar from './UserSideBar'
import { IoReorderThree } from 'react-icons/io5'

const Main = () => {
    const [toggle, setToggle] = useState(false)

    return (
        <div className='d-flex position-relative'>
            <div className={`${toggle ? "mobile-view-active" : 'mobile-view'}`}>
                <UserSideBar setToggle={setToggle} />
            </div>


            <IoReorderThree
                className='three-dot'
                size={40}
                onClick={() => setToggle(true)}
            />

            {/* for mobile view close the sidebar */}
            {/* start */}
            {toggle && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setToggle(false)}
                ></div>
            )}
            {/* end */}

            <div className="d-flex flex-grow-1">
                <Outlet />
            </div>
        </div>
    )
}

export default Main