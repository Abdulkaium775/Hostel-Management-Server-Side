import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };

  return (
    <section className="relative bg-indigo-600 py-16 px-6 sm:px-10 lg:px-16 rounded-2xl overflow-hidden max-w-7xl mx-auto mt-16 shadow-xl">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
          Get updates on the latest meals, promotions, and exclusive offers!
        </p>

        <form 
          onSubmit={handleSubscribe} 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-gray-900 flex-grow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <button 
            type="submit" 
            className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Subscribe
          </button>
        </form>

        {/* Optional accent icon or graphic */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">We respect your privacy. No spam, ever.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
