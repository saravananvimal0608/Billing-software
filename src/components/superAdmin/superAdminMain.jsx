import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { IoReorderThree } from "react-icons/io5";
import SuperAdminSidebar from './SuperAdminSidebar';


const SuperAdminMain = () => {
    const [toggle, setToggle] = useState(false)

    return (
        <div className='d-flex position-relative vh-100 overflow-hidden'>
            <div className={`${toggle ? "mobile-view-active" : 'mobile-view'}`}>
                <SuperAdminSidebar setToggle={setToggle} />
            </div>

            <IoReorderThree
                className='three-dot'
                size={40}
                onClick={() => setToggle(true)}
            />

            {toggle && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setToggle(false)}
                ></div>
            )}


            <div className='flex-grow-1 overflow-auto'>
                <Outlet />
            </div>


        </div>
    )
}

export default SuperAdminMain