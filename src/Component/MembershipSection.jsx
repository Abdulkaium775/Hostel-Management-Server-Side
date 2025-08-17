import { Link } from "react-router-dom";
import { FaCrown, FaStar, FaGem } from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * Palette:
 * Primary:   #4F46E5 (Indigo / Royal Blue)
 * Secondary: #06B6D4 (Cyan / Aqua Blue)
 * Neutral:   #F8FAFC (Light BG)
 * Heading:   #1E293B (Dark Slate Gray)
 */

const packages = [
  {
    name: "Silver",
    price: "$19.99",
    benefits: ["Access Upcoming Meals", "Priority Meal Request"],
    icon: <FaCrown className="text-4xl text-[#4F46E5]" />,
    glow: "from-[#4F46E5]/15 to-[#06B6D4]/15",
  },
  {
    name: "Gold",
    price: "$29.99",
    benefits: ["All Silver Benefits", "Faster Meal Approval", "Bonus Points"],
    icon: <FaStar className="text-4xl text-[#06B6D4]" />,
    glow: "from-[#06B6D4]/20 to-[#4F46E5]/20",
  },
  {
    name: "Platinum",
    price: "$49.99",
    benefits: ["All Gold Benefits", "Exclusive Dishes", "VIP Support"],
    icon: <FaGem className="text-4xl text-[#4F46E5]" />,
    glow: "from-[#4F46E5]/25 to-[#06B6D4]/25",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 12 },
  },
};

const MembershipSection = () => {
  return (
    <section
      className="
        relative py-20 px-6 sm:px-10 lg:px-16 mb-16
        bg-[radial-gradient(1200px_600px_at_10%_-10%,#06B6D40f,transparent_60%),radial-gradient(800px_400px_at_90%_110%,#4F46E510,transparent_60%),linear-gradient(180deg,#F8FAFC,white)]
      "
      aria-labelledby="membership-title"
    >
      {/* Section Heading */}
      <div className="text-center mb-14 relative z-10">
        <h2
          id="membership-title"
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1E293B]"
        >
          Upgrade Your Experience
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
          Choose a premium plan and unlock exclusive features
        </p>
        <span className="mt-4 inline-block h-1 w-28 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5]" />
      </div>

      {/* Packages Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {packages.map((pkg) => (
          <motion.div key={pkg.name} variants={cardVariants}>
            <Link
              to={`/checkout/${pkg.name.toLowerCase()}`}
              className="
                relative flex flex-col h-full rounded-2xl overflow-hidden
                p-8 shadow-lg bg-white/95 backdrop-blur-md
                ring-1 ring-slate-200 hover:shadow-xl
                transition-transform duration-300 hover:-translate-y-1.5
              "
            >
              {/* Glow Background */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr ${pkg.glow}`}
              />

              {/* Ribbon for Gold */}
              {pkg.name === "Gold" && (
                <div className="absolute top-0 right-0 bg-[#06B6D4] text-white text-xs px-3 py-1 rounded-bl-lg font-semibold shadow-md z-10">
                  Most Popular
                </div>
              )}

              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center flex-grow relative z-10">
                <div className="mb-4">{pkg.icon}</div>
                <h3 className="text-2xl font-bold text-[#1E293B] mb-1">
                  {pkg.name} Package
                </h3>
                <p className="text-lg sm:text-xl font-semibold text-[#4F46E5] mb-5">
                  {pkg.price}
                </p>

                {/* Benefits List */}
                <ul className="text-slate-600 text-sm sm:text-base space-y-3 mb-8">
                  {pkg.benefits.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 justify-center"
                    >
                      <span className="text-[#06B6D4]">✔</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="mt-auto w-full px-6 py-2.5 bg-[#4F46E5] hover:bg-[#06B6D4] text-white rounded-full font-medium shadow-md transition-all duration-300 relative z-10"
              >
                Choose {pkg.name}
              </button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 bg-gradient-to-tr from-[#4F46E5]/20 to-[#06B6D4]/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -top-40 -left-24 w-80 h-80 bg-gradient-to-tr from-[#06B6D4]/20 to-[#4F46E5]/20 rounded-full blur-3xl" />
    </section>
  );
};

export default MembershipSection;
