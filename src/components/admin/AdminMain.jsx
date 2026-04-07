import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import ExpiryCheck from "../ExpiryCheck";
import { commonApi } from "../../common/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const AdminMain = ({ toggleColor, setColorToggle }) => {
  const [toggle, setToggle] = useState(false);
  const [footerBanners, setFooterBanners] = useState([]);

  const handleBannerImage = async () => {
    try {
      const res = await commonApi({ endpoint: "api/banner" });
      const footer = res?.data?.data || [];
      setFooterBanners(footer);
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    handleBannerImage();
  }, []);

  return (
    <>
      <ExpiryCheck />
      <div className="d-flex position-relative vh-100 overflow-hidden">
        <div className={`${toggle ? "mobile-view-active" : "mobile-view"}`}>
          <AdminSideBar
            setToggle={setToggle}
            toggleColor={toggleColor}
            setColorToggle={setColorToggle}
          />
        </div>

        <IoReorderThree
          className="three-dot"
          size={40}
          onClick={() => setToggle(true)}
        />

        {toggle && (
          <div
            className="sidebar-overlay"
            onClick={() => setToggle(false)}
          ></div>
        )}

        <div className="flex-grow-1 overflow-auto d-flex flex-column">
          <div className="flex-grow-1">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="admin-footer">
            {footerBanners.length > 0 && (
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
              >
                {footerBanners.map((item) => (
                  <SwiperSlide key={item._id}>
                    <img
                      src={item.bannerImage}
                      alt="banner"
                      className="admin-footer-banner-img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </footer>
        </div>
      </div>
    </>
  );
};

export default AdminMain;
