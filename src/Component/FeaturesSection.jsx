import { motion } from "framer-motion";

const features = [
  {
    icon: "🍽️",
    title: "Nutritious & Balanced",
    description:
      "Meals prepared with nutrition in mind to keep you healthy and energized.",
    bgColor: "from-[#4F46E5] to-[#06B6D4]",
  },
  {
    icon: "⏰",
    title: "On-Time Service",
    description:
      "Enjoy your meals fresh and on time every day with reliable service.",
    bgColor: "from-[#06B6D4] to-[#4F46E5]",
  },
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    description:
      "We use only fresh, locally sourced ingredients for great taste.",
    bgColor: "from-[#4F46E5]/80 to-[#06B6D4]/80",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 mb-10">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-12"
        >
          Why Choose Our Hostel Meals?
        </motion.h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map(({ icon, title, description, bgColor }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.25 }}
              whileHover={{ scale: 1.05, rotateX: 3, rotateY: 3 }}
              className="relative bg-white rounded-3xl px-8 py-12 shadow-2xl cursor-pointer overflow-hidden"
            >
              {/* Gradient Glow Border */}
              <div
                className={`absolute -inset-1 rounded-3xl bg-gradient-to-tr ${bgColor} opacity-60 blur-2xl`}
                aria-hidden="true"
              />

              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={`flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${bgColor} text-4xl drop-shadow-xl mb-6`}
                >
                  {icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#1E293B] mb-3">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-[#1E293B]/80 text-base leading-relaxed max-w-xs">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
