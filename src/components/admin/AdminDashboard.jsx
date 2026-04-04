import React, { useEffect, useState } from "react";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import ApexChart from "../../common/ApexChart";
import ApexLine from "../../common/ApexLine";
import { toast } from "react-toastify";
import { commonApi } from "../../common/common";
import BannerSwiper from "../../common/Banner";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [banners, setBanners] = useState([]);
  const [imagePopup, setImagePopup] = useState(false);

  const revenue = totalRevenue?.totalRevenue || 0;
  const productCount = products?.length || 0;
  const categoryCount = categories?.length || 0;

  const handleRevenue = async () => {
    try {
      const res = await commonApi({ endpoint: "api/order/" });
      setTotalRevenue(res?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCategoryCount = async () => {
    try {
      const res = await commonApi({
        endpoint: "api/category/withoutPagination",
      });
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleProductCount = async () => {
    try {
      const res = await commonApi({
        endpoint: "api/product/withoutPagination",
      });
      setProducts(res.data.products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleBannerImage = async () => {
    try {
      const res = await commonApi({ endpoint: "api/banner" });

      const bannerData = res.data?.data || [];

      setBanners(bannerData);

      if (bannerData.length > 0) {
        setImagePopup(true);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    handleRevenue();
    handleCategoryCount();
    handleProductCount();
    handleBannerImage();
  }, []);

  console.log('banners',banners);
  

  return (
    <div className="w-100">
      {/* popup image */}
      {imagePopup && (
        <BannerSwiper banners={banners} onClose={() => setImagePopup(false)} />
      )}

      <div className="order-history-header mx-1 my-4">
        <h1 className="order-history-title">Admin Dashboard</h1>
      </div>

      <div className="row justify-content-evenly">
        <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            <p className="m-0">Total Revenue</p>
            <p>
              ${" "}
              {totalRevenue?.totalRevenue ? totalRevenue?.totalRevenue : "---"}
            </p>
          </div>
          <div>
            <RiMoneyRupeeCircleFill size={50} className="icon-symbol" />
          </div>
        </div>

        <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            {" "}
            <p className="m-0">Total Products</p>
            <p>{products ? products.length : "---"}</p>
          </div>
          <div>
            <AiOutlineProduct size={50} className="icon-symbol" />
          </div>
        </div>

        <div className="col-10 col-md-3  mb-3 dashboard-box d-flex justify-content-around align-items-center">
          <div>
            {" "}
            <p className="m-0">Total Categories</p>
            <p>{categories ? categories.length : "---"}</p>
          </div>
          <div>
            <MdCategory size={50} className="icon-symbol" />
          </div>
        </div>
      </div>

      <div className="row mt-1 justify-content-center gap-2">
        <div className="col-10 col-md-7 col-lg-5 mb-4 apex-chart-border">
          <ApexChart
            series={[Math.round(revenue / 1000), productCount, categoryCount]}
            labels={["Revenue (k)", "Products", "Categories"]}
          />
        </div>
        <div className="col-10 col-md-7 col-lg-5 mb-4 apex-chart-border">
          <ApexLine
            title="Admin Overview"
            categories={["Count"]}
            series={[
              { name: "Revenue", data: [revenue] },
              { name: "Products", data: [productCount] },
              { name: "Categories", data: [categoryCount] },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
