import React, { useEffect, useState } from 'react'
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import ApexChart from '../admin/ApexChart';
import ApexLine from '../admin/ApexLine'
import { toast } from 'react-toastify';
import { commonApi } from '../../common/common';

const Dashboard = () => {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(null)



    const handleRevenue = async () => {
        try {
            const res = await commonApi({ endpoint: "api/order/" })
            setTotalRevenue(res?.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleCategoryCount = async () => {
        try {
            const res = await commonApi({ endpoint: "api/category/withoutPagination" })
            setCategories(res.data.categories)
        } catch (error) {
              toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleProductCount = async () => {
        try {
            const res = await commonApi({ endpoint: "api/product/withoutPagination" })
            setProducts(res.data.products)
        } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        handleRevenue()
        handleCategoryCount()
        handleProductCount()
    }, [])



    return (
        <div className='w-100'>

            <h1 className='text-center my-3 login-title'>Admin Dashboard</h1>

            <div className='row justify-content-evenly'>
                <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">


                    <div >
                        <p className='m-0'>Total Revenue</p>
                        <p>$ {totalRevenue?.totalRevenue ? totalRevenue?.totalRevenue : "---"}</p>
                    </div>
                    <div>
                        <RiMoneyRupeeCircleFill size={50} className='icon-symbol' />
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
                        totalRevenue={totalRevenue?.totalRevenue}
                        productCount={products.length}
                        categoryCount={categories.length}
                    />
                </div>
                <div className='col-10 col-md-7 col-lg-5 mb-4 apex-chart-border'>
                    <ApexLine
                        totalRevenue={totalRevenue?.totalRevenue}
                        productCount={products.length}
                        categoryCount={categories.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard