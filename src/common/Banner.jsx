import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BannerSwiper = ({ banners, onClose }) => {
  return (
    <div className="img-popup-overlay" onClick={onClose}>
      <div
        className="img-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span className="img-popup-close" onClick={onClose}>
          ✕
        </span>

        <Swiper
          modules={[ Pagination, Autoplay]}
          navigation
          pagination={{ clickable: false }}
          autoplay={{ delay: 2500 }}
          loop={true}
          className="mySwiper"
        >
          {banners?.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.bannerImage}
                alt="banner"
                className="img-popup-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerSwiper;