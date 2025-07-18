import React from "react";
import { GrUserAdmin } from "react-icons/gr";  // Admin icon
import { FaUser } from "react-icons/fa";       // User icon
import useAdmin from "../hooks/Admin";          // Your custom admin check hook
import { Link, Outlet } from "react-router";

const Dashboard = () => {
  const [isAdmin] = useAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-6">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          {isAdmin ? (
            <GrUserAdmin className="text-blue-600" />
          ) : (
            <FaUser className="text-green-600" />
          )}
          {isAdmin ? "Admin Dashboard" : "User Dashboard"}
        </h2>

        {/* Navigation */}
        {isAdmin ? (
          <nav className="flex flex-col gap-4 text-gray-700 text-lg">
            <Link to="/dashboard/admin-profile" className="hover:text-blue-600 transition">Admin Profile</Link>
            <Link to="/dashboard/manage-users" className="hover:text-blue-600 transition">Manage Users</Link>
            <Link to="/dashboard/add-meal" className="hover:text-blue-600 transition">Add Meal</Link>
            <Link to="/dashboard/all-meals" className="hover:text-blue-600 transition">All Meals</Link>
            <Link to="/dashboard/all-reviews" className="hover:text-blue-600 transition">All Reviews</Link>
            <Link to="/dashboard/serve-meals" className="hover:text-blue-600 transition">Serve Meals</Link>
            <Link to="/dashboard/upcoming-meals" className="hover:text-blue-600 transition">Upcoming Meals</Link>
          </nav>
        ) : (
          <nav className="flex flex-col gap-4 text-gray-700 text-lg">
            <Link to="/dashboard/my-profile" className="hover:text-green-600 transition">My Profile</Link>
            <Link to="/dashboard/requested-meals" className="hover:text-green-600 transition">Requested Meals</Link>
            <Link to="/dashboard/my-reviews" className="hover:text-green-600 transition">My Reviews</Link>
            <Link to="/dashboard/payment-history" className="hover:text-green-600 transition">Payment History</Link>
          </nav>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-white overflow-auto">
        <Outlet/> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

export default Dashboard;
