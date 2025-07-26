import React, { useState } from "react";
import { GrUserAdmin } from "react-icons/gr"; // Admin main icon
import { FaUser, FaUsers, FaUtensils, FaClipboardList, FaRegStar, FaConciergeBell, FaCalendarAlt } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import useRole from "../hooks/Admin";

const Dashboard = () => {
  const [role, loading] = useRole();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  const isAdmin = role === "admin";

  // Icons per link for admin and user nav
  const adminLinks = [
    { to: "/dashboard/admin-profile", label: "Admin Profile", icon: <GrUserAdmin className="text-blue-600 w-5 h-5" /> },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: <FaUsers className="text-purple-600 w-5 h-5" /> },
    { to: "/dashboard/add-meal", label: "Add Meal", icon: <FaUtensils className="text-red-500 w-5 h-5" /> },
    { to: "/dashboard/all-meals", label: "All Meals", icon: <FaClipboardList className="text-yellow-600 w-5 h-5" /> },
    { to: "/dashboard/all-reviews", label: "All Reviews", icon: <FaRegStar className="text-orange-500 w-5 h-5" /> },
    { to: "/dashboard/serve-meals", label: "Serve Meals", icon: <FaConciergeBell className="text-green-600 w-5 h-5" /> },
    { to: "/dashboard/upcoming-meals", label: "Upcoming Meals", icon: <FaCalendarAlt className="text-teal-600 w-5 h-5" /> },
  ];

  const userLinks = [
    { to: "/dashboard/my-profile", label: "My Profile", icon: <FaUser className="text-green-600 w-5 h-5" /> },
    { to: "/dashboard/requested-meals", label: "Requested Meals", icon: <FaUtensils className="text-red-500 w-5 h-5" /> },
    { to: "/dashboard/my-reviews", label: "My Reviews", icon: <FaRegStar className="text-yellow-600 w-5 h-5" /> },
    { to: "/dashboard/payment-history", label: "Payment History", icon: <FaClipboardList className="text-blue-600 w-5 h-5" /> },
  ];

  // Choose links based on role
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for md+ */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow p-6">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          {isAdmin ? (
            <GrUserAdmin className="text-blue-600 w-8 h-8" />
          ) : (
            <FaUser className="text-green-600 w-8 h-8" />
          )}
          <span>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</span>
        </h2>
        <nav className="flex flex-col gap-4 text-gray-700 text-lg">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 hover:text-${isAdmin ? "blue" : "green"}-600 transition`}
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile top nav */}
      <header className="md:hidden bg-white shadow flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <GrUserAdmin className="text-blue-600 w-7 h-7" />
          ) : (
            <FaUser className="text-green-600 w-7 h-7" />
          )}
          <h1 className="text-xl font-semibold">{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          className="focus:outline-none"
        >
          <svg
            className="w-8 h-8 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow p-4 flex flex-col gap-4 text-gray-700 text-lg">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 hover:text-${isAdmin ? "blue" : "green"}-600 transition`}
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 bg-white overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
