import React from "react";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#06B6D4] to-[#0ea5e9] text-[#F8FAFC] py-16 px-6 md:px-20 rounded-xl shadow-lg max-w-7xl mx-auto my-8 overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            🌟 Special Promotion!
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-6">
            Enjoy exclusive discounts on our premium meals this week. Don’t miss this opportunity to taste the best!
          </p>
          <Link
            to="/featured"
            className="inline-block bg-white text-[#06B6D4] px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transition transform hover:-translate-y-1"
          >
            Explore Now
          </Link>
        </div>
        <div className="hidden md:block">
          <img
            src="/promotion-food.png"
            alt="Promotion"
            className="w-72 h-72 object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Promotion;
