import React from 'react';

const SalesPromotion = () => {
  return (
    <section className="relative bg-[#F8FAFC] mb-10 py-16 px-6 sm:px-10 lg:px-16 rounded-2xl overflow-hidden max-w-7xl mx-auto mt-16 shadow-2xl">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#06B6D4]/10 rounded-full blur-3xl"></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] mb-4">
            Limited Time Offer!
          </h2>
          <p className="text-lg sm:text-xl text-[#1E293B]/80 mb-6 max-w-md mx-auto lg:mx-0">
            Enjoy <span className="font-bold underline decoration-[#4F46E5]/50">20% off</span> on all premium meals this week.
            Upgrade your badge now and get exclusive access to top-rated meals and rewards!
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="bg-[#4F46E5] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-[#06B6D4] transition duration-300">
              Claim Offer
            </button>
            <button className="bg-white text-[#4F46E5] font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image Card */}
        <div className="flex-1 relative max-w-sm mx-auto lg:mx-0">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:scale-105 transform transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500"
              alt="Premium Meal"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute top-4 left-4 bg-yellow-400 text-[#1E293B] font-bold px-3 py-1 rounded-full text-sm shadow-md">
              20% OFF
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 text-[#1E293B] font-semibold px-3 py-1 rounded-lg text-sm shadow-sm">
              Premium Meal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPromotion;
