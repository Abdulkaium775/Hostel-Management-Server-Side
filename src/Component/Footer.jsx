
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-3 mb-4 h-8 w-8">
          <img src="data:image/png;base64,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





" alt="" />
            <span className="text-3xl font-bold tracking-wide">HostelMeals</span>
          </div>
          <p className="max-w-xs text-center md:text-left opacity-80">
            Delicious and nutritious meals served fresh daily to our university hostel students. Join us and enjoy the best dining experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-pink-400 pb-2 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { name: "Home", href: "/" },
              { name: "Meals", href: "/meals" },
              { name: "Upcoming Meals", href: "/upcoming-meals" },
              { name: "Join Us", href: "/join-us" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-pink-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-pink-400 pb-2 inline-block">
            Contact Us
          </h3>
          <p className="opacity-80 mb-2">University Hostel Office</p>
          <p className="opacity-80 mb-2">Email: support@hostelmeals.com</p>
          <p className="opacity-80 mb-2">Phone: +880 1234 567 890</p>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-pink-400 text-indigo-900 hover:bg-pink-300 hover:text-indigo-800 transition-colors duration-300"
                aria-label="social media link"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-pink-700 my-8" />

      <p className="text-center opacity-60 text-sm select-none">
        &copy; {new Date().getFullYear()} HostelMeals. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
