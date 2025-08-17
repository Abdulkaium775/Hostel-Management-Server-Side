import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mt-18 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-[#4F46E5]/90 to-[#06B6D4]/90">
      {/* Floating Blobs / Lights */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-white/0 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#ffffff10] rounded-full blur-2xl animate-pulse"></div>

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
            className="
              w-full px-5 py-4 rounded-xl text-[#1E293B] bg-white/30 backdrop-blur-md shadow-lg
              flex-grow focus:outline-none focus:ring-4 focus:ring-[#06B6D4]/60 transition
            "
          />
          <button
            type="submit"
            className="
              bg-white text-[#4F46E5] font-bold px-8 py-4 rounded-xl shadow-xl
              hover:shadow-2xl hover:bg-[#06B6D4] hover:text-white transition-all duration-300
              transform hover:-translate-y-1
            "
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
