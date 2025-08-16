import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#F8FAFC] text-[#1E293B] py-16 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* Floating Background Circles */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#4F46E5]/20 rounded-full blur-3xl animate-slow-spin"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#06B6D4]/20 rounded-full blur-3xl animate-slow-spin-reverse"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="text-2xl font-bold tracking-wide text-[#4F46E5]">
              Hostel Meals
            </span>
          </div>
          <p className="max-w-sm opacity-80 text-sm sm:text-base">
            Delicious and nutritious meals served fresh daily to university hostel students.
            Join us and enjoy the best dining experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-[#06B6D4] pb-2 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm sm:text-base">
            {[
              { name: "Home", href: "/" },
              { name: "Meals", href: "/meals" },
              { name: "Upcoming Meals", href: "/upcoming-meals" },
              { name: "Join Us", href: "/join-us" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-[#06B6D4] transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-[#06B6D4] pb-2 inline-block">
            Contact Us
          </h3>
          <p className="opacity-80 mb-2 text-sm sm:text-base">University Hostel Office</p>
          <p className="opacity-80 mb-2 text-sm sm:text-base">Email: support@hostelmeals.com</p>
          <p className="opacity-80 mb-4 text-sm sm:text-base">Phone: +880 1234 567 890</p>

          <div className="flex justify-center md:justify-start space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-3 rounded-full bg-[#4F46E5] text-white hover:bg-[#06B6D4] hover:text-[#1E293B] shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[#06B6D4]/30 my-8" />

      {/* Copyright */}
      <p className="text-center opacity-60 text-xs sm:text-sm select-none">
        &copy; {new Date().getFullYear()} HostelMeals. All rights reserved.
      </p>

      {/* Animations */}
      <style>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
        .animate-slow-spin-reverse {
          animation: slow-spin-reverse 80s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
