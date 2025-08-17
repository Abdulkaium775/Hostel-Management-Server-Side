import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "Explore the Flavors of Hostel Life",
    description: "Enjoy tasty, nutritious meals every day, freshly prepared with care.",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-indigo-700 via-indigo-600 to-indigo-500",
  },
  {
    title: "Get Exclusive Premium Access",
    description: "Unlock upcoming meals and features with your premium badge!",
    image:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-cyan-400 via-cyan-300 to-cyan-200",
  },
  {
    title: "Healthy & Fresh Meals",
    description: "Balanced meals every day to stay energized and focused.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-green-400 via-green-300 to-cyan-200",
  },
];

const Slider = () => {
  return (
    <div className="relative w-full h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] mb-10">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        slidesPerView={1}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <div
                className="w-full h-full bg-center bg-cover transition-transform duration-1000 ease-in-out hover:scale-105 relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${slide.gradient} opacity-60`}
                />
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/25" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-20 lg:px-32 text-white z-20">
                  <div className="max-w-2xl space-y-4 sm:space-y-5">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-md">
                      {slide.description}
                    </p>

                    {/* Optional Search Box */}
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="flex w-full max-w-md rounded-lg overflow-hidden bg-white/30 backdrop-blur-md shadow-lg border border-white/30 mt-2"
                    >
                      <input
                        type="text"
                        placeholder="Search meals..."
                        className="flex-grow px-4 py-2 sm:px-5 sm:py-3 text-[#1E293B] placeholder-gray-400 bg-transparent outline-none text-sm sm:text-base"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-6 py-2 font-medium transition text-sm sm:text-base"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
