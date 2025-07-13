import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" // Replace with your own logo if needed
              alt="Logo"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold tracking-wide">
              Hostel Management
            </span>
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
                aria-label={`social media link ${i + 1}`}
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
