import React, { useState } from 'react'
import AdminSideBar from './AdminSideBar'
import { Outlet } from 'react-router-dom'
import { IoReorderThree } from "react-icons/io5";


const AdminDashboard = () => {
    const [toggle, setToggle] = useState(false)

    return (
        <div className='d-flex position-relative'>
            <div className={`${toggle ? "mobile-view-active" : 'mobile-view'}`}>
                <AdminSideBar setToggle={setToggle} />
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


            <div className='d-flex flex-grow-1 '>
                <Outlet />
            </div>


        </div>
    )
}

export default AdminDashboard