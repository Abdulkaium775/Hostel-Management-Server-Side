import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "Explore the Flavors of Hostel Life",
    description: "Enjoy tasty, nutritious meals every single day—crafted with love.",
    image: "https://source.unsplash.com/1600x600/?hostel,food",
  },
  {
    title: "Your Meal, Your Choice",
    description: "From breakfast to dinner, choose what suits your cravings.",
    image: "https://source.unsplash.com/1600x600/?college,dining",
  },
  {
    title: "Get Exclusive Premium Access",
    description: "Unlock upcoming meals and features with a premium badge!",
    image: "https://source.unsplash.com/1600x600/?meal,healthy",
  },
];

const Slider = () => {
  return (
    <div className="relative w-full h-[80vh] bg-white py-5">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={800}
        loop={true}
        slidesPerView={1}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative w-full h-full rounded-lg overflow-hidden shadow-xl"
              style={{ perspective: "1500px" }}
            >
              <div
                className="w-full h-full bg-center bg-cover transform transition-transform duration-1000 ease-in-out hover:scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b]/90 via-[#0ea5e9]/70 to-[#f97316]/70 backdrop-blur-sm mix-blend-screen" />
                <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-20 text-white max-w-3xl space-y-5 z-20">
                  <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-2xl drop-shadow-md">{slide.description}</p>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full max-w-md rounded-lg overflow-hidden bg-white/20 backdrop-blur-lg shadow-lg border border-white/30"
                  >
                    <input
                      type="text"
                      placeholder="Search meals..."
                      className="flex-grow px-5 py-3 text-white placeholder-white/80 bg-transparent outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 font-medium transition"
                    >
                      Search
                    </button>
                  </form>
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
