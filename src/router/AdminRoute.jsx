import React, { useContext } from 'react';
import useAdmin from '../hooks/Admin';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';


const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isAdmin, adminLoading] = useAdmin();
  const location = useLocation();

  // Show loading spinner while auth or admin loading
  if (authLoading || adminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but NOT admin, redirect to unauthorized
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in and admin: render protected content
  return children;
};

export default AdminRoute;