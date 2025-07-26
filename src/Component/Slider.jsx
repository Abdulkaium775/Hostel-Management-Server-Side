import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "Explore the Flavors of Hostel Life",
    description: "Enjoy tasty, nutritious meals every single day—crafted with love.",
    image: "https://source.unsplash.com/1600x600/?hostel,food",
    gradient: "from-purple-700 via-pink-500 to-red-400",
  },
  {
    title: "Your Meal, Your Choice",
    description: "From breakfast to dinner, choose what suits your cravings.",
    image: "https://source.unsplash.com/1600x600/?college,dining",
    gradient: "from-teal-700 via-cyan-500 to-blue-400",
  },
  {
    title: "Get Exclusive Premium Access",
    description: "Unlock upcoming meals and features with a premium badge!",
    image: "https://source.unsplash.com/1600x600/?meal,healthy",
    gradient: "from-yellow-500 via-orange-400 to-red-400",
  },
];

const Slider = () => {
  return (
    <div className="relative w-full h-[75vh] sm:h-[80vh] md:h-[85vh] bg-white py-5">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        speed={800}
        loop={true}
        slidesPerView={1}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`relative w-full h-full rounded-lg overflow-hidden shadow-xl bg-gradient-to-tr ${slide.gradient}`}
              style={{ perspective: "1500px" }}
            >
              <div
                className="w-full h-full bg-center bg-cover transform transition-transform duration-1000 ease-in-out hover:scale-105 relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-20 text-white z-20">
                  <div className="max-w-2xl space-y-4 sm:space-y-5">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-2xl drop-shadow-md">
                      {slide.description}
                    </p>

                    {/* Search Box */}
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="flex w-full max-w-md rounded-lg overflow-hidden bg-white/20 backdrop-blur-lg shadow-lg border border-white/30"
                    >
                      <input
                        type="text"
                        placeholder="Search meals..."
                        className="flex-grow px-4 py-2 sm:px-5 sm:py-3 text-white placeholder-white/80 bg-transparent outline-none text-sm sm:text-base"
                      />
                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-6 py-2 font-medium transition text-sm sm:text-base"
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
