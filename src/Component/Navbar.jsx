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
      setDropdownOpen(false);
      closeMobileMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavLinkClick = () => {
    closeDropdown();
    closeMobileMenu();
  };

  return (
    <nav className="bg-indigo-700 shadow-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo + Website Name */}
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl text-white"
          onClick={handleNavLinkClick}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span>Hostel Management</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {["/", "/meals", "/upcoming-meals"].map((path) => {
            const text =
              path === "/"
                ? "Home"
                : path
                    .slice(1)
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <NavLink
                key={path}
                to={path}
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1 font-semibold"
                    : "text-white hover:text-cyan-400 transition-colors duration-300"
                }
              >
                {text}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Notification Icon */}
          <button
            aria-label="Notifications"
            className="relative text-white hover:text-cyan-400 focus:outline-none transition-colors duration-300"
          >
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                   6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165
                   6 8.388 6 11v3.159c0 .538-.214 1.055-.595
                   1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              3
            </span>
          </button>

          {/* Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <Link
              to="/join-us"
              className="px-4 py-2 bg-cyan-400 text-indigo-900 rounded font-semibold hover:bg-cyan-300 transition duration-300"
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none rounded-full overflow-hidden border-2 border-cyan-400"
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
                    className="absolute right-0 mt-2 w-48 bg-white text-darkText rounded-md shadow-lg py-2 z-50"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="truncate font-semibold text-darkText">{user.displayName || user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-darkText"
                      onClick={closeDropdown}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-darkText"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-700/95 px-4 pt-2 pb-4 space-y-2">
          {["/", "/meals", "/upcoming-meals"].map((path) => {
            const text =
              path === "/"
                ? "Home"
                : path
                    .slice(1)
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <NavLink
                key={path}
                to={path}
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "block text-cyan-400 border-b-2 border-cyan-400 pb-1 font-semibold"
                    : "block text-white hover:text-cyan-400 transition-colors duration-300 py-1"
                }
              >
                {text}
              </NavLink>
            );
          })}

          <div className="border-t border-cyan-400 mt-2 pt-2">
            {!user ? (
              <Link
                to="/join-us"
                onClick={handleNavLinkClick}
                className="block px-4 py-2 bg-cyan-400 text-indigo-900 rounded-lg font-semibold hover:bg-cyan-300 transition duration-300"
              >
                Join Us
              </Link>
            ) : (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-50 rounded-lg mb-2 shadow-inner">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <p className="text-darkText truncate font-medium">{user.displayName || user.email}</p>
                </div>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  onClick={handleNavLinkClick}
                  className="block px-4 py-2 text-black bg-primary hover:bg-indigo-700 rounded-lg transition duration-300 font-medium"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-2 text-black bg-primary hover:bg-indigo-700 rounded-lg transition duration-300 font-medium mt-1"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
