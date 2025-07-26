import { motion } from "framer-motion";

const features = [
  {
    icon: "🍽️",
    title: "Nutritious & Balanced",
    description: "Meals prepared with nutrition in mind to keep you healthy and energized.",
    bgColor: "from-green-400 to-blue-500",
  },
  {
    icon: "⏰",
    title: "On-Time Service",
    description: "Enjoy your meals fresh and on time every day with reliable service.",
    bgColor: "from-yellow-400 to-red-500",
  },
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    description: "We use only fresh, locally sourced ingredients for great taste.",
    bgColor: "from-purple-400 to-pink-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 sm:mb-14 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
        Why Choose Our Hostel Meals?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        {features.map(({ icon, title, description, bgColor }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.3 }}
            whileHover={{ scale: 1.05, rotateX: 4, rotateY: 4 }}
            className="relative bg-gray-900 rounded-3xl px-6 py-10 sm:px-8 sm:py-12 shadow-2xl cursor-pointer"
          >
            {/* Gradient Glow Border */}
            <div
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-tr ${bgColor} opacity-60 blur-xl`}
              aria-hidden="true"
            />

            {/* Card Content */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${bgColor} text-3xl sm:text-4xl drop-shadow-lg mb-6`}
              >
                {icon}
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white">
                {title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-xs">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
