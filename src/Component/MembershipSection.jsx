import { Link } from "react-router-dom";
import { FaCrown, FaStar, FaGem } from "react-icons/fa";

const MembershipSection = () => {
  const packages = [
    {
      name: "Silver",
      price: "$19.99",
      benefits: ["Access Upcoming Meals", "Priority Meal Request"],
      icon: <FaCrown className="text-3xl text-[#4F46E5]" />,
      bg: "bg-[#F8FAFC]",
      ring: "ring-[#4F46E5]/20",
    },
    {
      name: "Gold",
      price: "$29.99",
      benefits: ["All Silver Benefits", "Faster Meal Approval", "Bonus Points"],
      icon: <FaStar className="text-3xl text-[#06B6D4]" />,
      bg: "bg-[#F8FAFC]",
      ring: "ring-[#06B6D4]/30",
    },
    {
      name: "Platinum",
      price: "$49.99",
      benefits: ["All Gold Benefits", "Exclusive Dishes", "VIP Support"],
      icon: <FaGem className="text-3xl text-[#4F46E5]" />,
      bg: "bg-[#F8FAFC]",
      ring: "ring-[#4F46E5]/40",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 bg-[#F8FAFC]">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-3">
          Upgrade Your Experience
        </h2>
        <p className="text-[#1E293B]/80 text-base sm:text-lg max-w-2xl mx-auto">
          Choose a premium plan and unlock exclusive features
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {packages.map((pkg) => (
          <Link
            to={`/checkout/${pkg.name.toLowerCase()}`}
            key={pkg.name}
            className={`relative rounded-3xl p-6 sm:p-7 md:p-8 shadow-lg border-t-4 border-[#4F46E5]/20 hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 ${pkg.bg} ring-2 ${pkg.ring} flex flex-col`}
          >
            {/* Ribbon for Gold plan */}
            {pkg.name === "Gold" && (
              <div className="absolute top-0 right-0 bg-[#06B6D4] text-white text-xs px-2 py-1 rounded-bl-xl font-bold shadow-md z-10">
                Most Popular
              </div>
            )}

            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center flex-grow">
              <div className="mb-4">{pkg.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E293B] mb-2">
                {pkg.name} Package
              </h3>
              <p className="text-lg sm:text-xl font-semibold text-[#4F46E5] mb-4">
                {pkg.price}
              </p>
              <ul className="text-[#1E293B]/80 text-sm sm:text-base space-y-2 mb-6">
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

            {/* Choose Button */}
            <button
              type="button"
              className="mt-auto w-full px-5 py-2 sm:py-2.5 bg-[#4F46E5] hover:bg-[#06B6D4] text-white rounded-full font-medium shadow transition duration-300"
            >
              Choose {pkg.name}
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MembershipSection;
