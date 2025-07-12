import React from "react";
import { Link, Outlet } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";  // Icon component
import { FaUser } from "react-icons/fa";       // User icon (optional)
import useAdmin from "../hooks/Admin";
     // Your custom admin hook

const Dashboard = () => {
  const [isAdmin] = useAdmin();  // Example hook returning [boolean]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-5">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {isAdmin ? <GrUserAdmin className="text-blue-600" /> : <FaUser className="text-green-600" />}
          {isAdmin ? "Admin Dashboard" : "User Dashboard"}
        </h2>

        {isAdmin ? (
          <nav className="flex flex-col gap-3">
            <Link to="/dashboard/admin-profile" className="hover:text-blue-600">Admin Profile</Link>
            <Link to="/dashboard/manage-users" className="hover:text-blue-600">Manage Users</Link>
            <Link to="/dashboard/add-meal" className="hover:text-blue-600">Add Meal</Link>
            <Link to="/dashboard/all-meals" className="hover:text-blue-600">All Meals</Link>
            <Link to="/dashboard/all-reviews" className="hover:text-blue-600">All Reviews</Link>
            <Link to="/dashboard/serve-meals" className="hover:text-blue-600">Serve Meals</Link>
            <Link to="/dashboard/upcoming-meals" className="hover:text-blue-600">Upcoming Meals</Link>
          </nav>
        ) : (
          <nav className="flex flex-col gap-3">
            <Link to="/dashboard/my-profile" className="hover:text-green-600">My Profile</Link>
            <Link to="/dashboard/requested-meals" className="hover:text-green-600">Requested Meals</Link>
            <Link to="/dashboard/my-reviews" className="hover:text-green-600">My Reviews</Link>
            <Link to="/dashboard/payment-history" className="hover:text-green-600">Payment History</Link>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This renders nested dashboard routes */}
      </main>
    </div>
  );
};

export default Dashboard;
