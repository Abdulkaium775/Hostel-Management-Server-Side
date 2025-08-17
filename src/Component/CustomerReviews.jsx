import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Student, Hostel Resident",
    review:
      "The meals are absolutely delicious and well-balanced! I never expected hostel food to be this good. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "David Smith",
    role: "University Student",
    review:
      "Affordable, tasty, and hygienic! The best part is the variety in meals. Every day feels exciting!",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Premium Subscriber",
    review:
      "Their premium subscription was worth every penny. Exclusive meals, priority service, and healthy options!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

const StarRating = ({ value }) => {
  const full = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f-${i}`} className="text-yellow-400 text-lg" />
      ))}
      {hasHalf && <FaStarHalfAlt className="text-yellow-400 text-lg" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e-${i}`} className="text-yellow-400 text-lg" />
      ))}
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 12 } },
};

const CustomerReviews = () => {
  return (
    <section className="relative bg-[#F8FAFC] py-20 px-6 sm:px-10 lg:px-16 rounded-2xl overflow-hidden mb-10">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] mb-3">
          Loved by Our Students
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-6">
          Real testimonials from happy customers. See why everyone loves our meals.
        </p>
        <span className="inline-block h-1 w-28 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5]" />
      </div>

      {/* Testimonials Grid */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {TESTIMONIALS.map((t) => (
          <motion.article
            key={t.id}
            variants={cardVariants}
            className="group relative flex flex-col p-8 bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Quote Icon */}
            <FaQuoteLeft className="absolute -top-5 -left-5 text-[#06B6D4] text-4xl opacity-20" />

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full border-2 border-[#4F46E5] shadow-sm object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-[#1E293B]">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>

            {/* Review */}
            <blockquote className="text-slate-700 mb-6 leading-relaxed">
              “{t.review}”
            </blockquote>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <StarRating value={t.rating} />
              <span className="ml-3 inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white/90">
                {t.rating.toFixed(1)} / 5
              </span>
            </div>

            {/* Soft hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "radial-gradient(600px 200px at 20% 0%, rgba(79,70,229,0.06), transparent 60%)",
              }}
            />
          </motion.article>
        ))}
      </motion.div>

      {/* Soft decorative blobs */}
      <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-gradient-to-tr from-[#4F46E5]/10 to-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-20 w-72 h-72 bg-gradient-to-tr from-[#06B6D4]/10 to-[#4F46E5]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default CustomerReviews;
