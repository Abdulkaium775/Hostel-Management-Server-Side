import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

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

  // Close dropdown or mobile menu on navigation
  const handleNavLinkClick = () => {
    closeDropdown();
    closeMobileMenu();
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Logo + Site Name */}
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl"
          onClick={handleNavLinkClick}
        >
          {/* Replace '/logo.png' with your actual logo path or remove this img if no logo */}
          <img
            src=""
            alt="Logo"
            className="h-8 w-8"
          />
          <span>Hostel Management </span>
        </Link>

        {/* Middle: Navigation Links for md+ */}
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
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-white hover:text-lime-100 transition-colors duration-300"
                }
              >
                {text}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Notification Icon */}
          <button
            aria-label="Notifications"
            className="relative text-white hover:text-lime-100 focus:outline-none transition-colors duration-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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

          {/* Hamburger menu button */}
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Right: User avatar or Join Us for md+ */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <Link
              to="/join-us"
              className="px-4 py-2 bg-white text-teal-600 rounded font-semibold hover:bg-lime-100 transition duration-300"
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none rounded-full overflow-hidden border-2 border-white"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  className="h-10 w-10 object-cover"
                />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2 z-50"
                  onMouseLeave={closeDropdown}
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="truncate font-semibold">
                      {user.displayName || user.email}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-900/95 px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            onClick={handleNavLinkClick}
            className={({ isActive }) =>
              isActive
                ? "block text-white border-b-2 border-white pb-1"
                : "block text-white hover:text-lime-100 transition-colors duration-300 py-1"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/meals"
            onClick={handleNavLinkClick}
            className={({ isActive }) =>
              isActive
                ? "block text-white border-b-2 border-white pb-1"
                : "block text-white hover:text-lime-100 transition-colors duration-300 py-1"
            }
          >
            Meals
          </NavLink>
          <NavLink
            to="/upcoming-meals"
            onClick={handleNavLinkClick}
            className={({ isActive }) =>
              isActive
                ? "block text-white border-b-2 border-white pb-1"
                : "block text-white hover:text-lime-100 transition-colors duration-300 py-1"
            }
          >
            Upcoming Meals
          </NavLink>

          <div className="border-t border-indigo-700 mt-2 pt-2">
            {!user ? (
              <Link
                to="/join-us"
                onClick={handleNavLinkClick}
                className="block px-4 py-2 bg-white text-teal-600 rounded font-semibold hover:bg-lime-100 transition duration-300"
              >
                Join Us
              </Link>
            ) : (
              <>
                <div className="flex items-center space-x-3 px-4 py-2">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white"
                  />
                  <p className="text-white truncate">{user.displayName || user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={handleNavLinkClick}
                  className="block px-4 py-2 text-white hover:bg-indigo-700 rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-700 rounded"
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
