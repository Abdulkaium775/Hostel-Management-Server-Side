import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeDropdown();
      closeMobileMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navbar links
  const guestLinks = [
    { path: "/", label: "Home" },
    { path: "/meals", label: "Meals" },
    { path: "/join-us", label: "Join Us" },
  ];

  const userLinks = [
    { path: "/", label: "Home" },
    { path: "/meals", label: "Meals" },
    { path: "/upcoming-meals", label: "Upcoming Meals" },
    { path: "/featured", label: "Featured-Meals" },
    { path: "/newsletter", label: "Newsletter" },
  ];

  const linksToRender = user ? userLinks : guestLinks;

  return (
    <nav className="bg-[#4F46E5] fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl text-white"
          onClick={closeMobileMenu}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span>Hostel Management</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {linksToRender.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeDropdown}
              className={({ isActive }) =>
                isActive
                  ? "text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
                  : "text-white hover:text-[#06B6D4] transition-colors duration-300"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop User Menu */}
        {user && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none rounded-full overflow-hidden border-2 border-[#06B6D4]"
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  className="h-10 w-10 object-cover"
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-[#1E293B] rounded-md shadow-lg py-2 z-50"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="truncate font-semibold">
                        {user.displayName || user.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={closeDropdown}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#4F46E5]/95 px-4 pt-2 pb-4 space-y-2">
          {linksToRender.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                closeMobileMenu();
                closeDropdown();
              }}
              className={({ isActive }) =>
                isActive
                  ? "block text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
                  : "block text-white hover:text-[#06B6D4] transition-colors duration-300 py-1"
              }
            >
              {label}
            </NavLink>
          ))}

          {user && (
            <div className="border-t border-[#06B6D4] mt-2 pt-2 space-y-1">
              <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-lg shadow-inner">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#06B6D4]"
                />
                <p className="text-[#1E293B] truncate font-medium">
                  {user.displayName || user.email}
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-2 bg-white text-[#1E293B] rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-white text-[#1E293B] rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
