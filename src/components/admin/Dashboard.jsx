import React, { useEffect, useState } from 'react'
import { FaUsers } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import axios from 'axios';
import ApexChart from '../admin/ApexChart';
import ApexLine from '../admin/ApexLine'
import { toast } from 'react-toastify';

const Dashboard = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [data, setData] = useState([])
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const token = localStorage.getItem("token");



    const handleUserCount = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/users/allUser`)
            setData(res.data.data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const handleCategoryCount = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/category/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategories(res.data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const handleProductCount = async () => {
        try {
            const res = await axios.get(`${baseUrl}api/product/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProducts(res.data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const filteredUsers = data.filter(user => user.role === false)

    useEffect(() => {
        handleUserCount()
        handleCategoryCount()
        handleProductCount()
    }, [])


    console.log(data);


    return (
        <div className='w-100'>

            <h1 className='text-center my-3 login-title'>Admin Dashboard</h1>

            <div className='row justify-content-evenly'>
                <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">


                    <div >
                        <p className='m-0'>Total Users</p>
                        <p>{filteredUsers ? filteredUsers.length : "---"}</p>
                    </div>
                    <div>
                        <FaUsers size={50} className='icon-symbol' />
                    </div>

                </div>


                <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">


                    <div > <p className='m-0'>Total Products</p>
                        <p>{products ? products.length : "---"}</p>
                    </div>
                    <div>
                        <AiOutlineProduct size={50} className='icon-symbol' />
                    </div>

                </div>



                <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">
                    <div > <p className='m-0'>Total Categories</p>
                        <p>{categories ? categories.length : "---"}</p>
                    </div>
                    <div>
                        <MdCategory size={50} className='icon-symbol' />
                    </div>
                </div>

            </div>


            <div className='row mt-1 justify-content-center gap-2'>
                <div className='col-10 col-md-7 col-lg-5 mb-4 apex-chart-border'>
                    <ApexChart
                        userCount={filteredUsers.length}
                        productCount={products.length}
                        categoryCount={categories.length}
                    />
                </div>
                <div className='col-10 col-md-7 col-lg-5 mb-4 apex-chart-border'>
                    <ApexLine
                        userCount={filteredUsers.length}
                        productCount={products.length}
                        categoryCount={categories.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard