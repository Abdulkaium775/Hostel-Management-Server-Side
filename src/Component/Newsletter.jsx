import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="relative bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] py-20 px-6 sm:px-12 lg:px-20 rounded-3xl overflow-hidden max-w-7xl mx-auto mt-20 shadow-2xl">
      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative text-center z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Stay Updated with Our Newsletter
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-sm">
          📩 Get the latest meals, promotions, and exclusive offers delivered
          straight to your inbox!
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-5 py-4 rounded-xl text-[#1E293B] bg-white/90 backdrop-blur-md shadow-md flex-grow focus:outline-none focus:ring-4 focus:ring-[#06B6D4] transition"
          />
          <button
            type="submit"
            className="bg-[#F8FAFC] text-[#4F46E5] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-[#06B6D4] hover:text-white transition-all duration-300 transform hover:-translate-y-1"
          >
            Subscribe
          </button>
        </form>

        {/* Privacy Note */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            🔒 We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
