import React, { useContext } from 'react';
import { AuthContext } from '../component/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import useAdmin from '../hooks/Admin';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // Auth loading & user info
  const [isAdmin] = useAdmin();                      // Your custom admin check hook
  const location = useLocation();

  // Show loading spinner while auth or admin status is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but NOT admin, redirect to unauthorized page
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If logged in AND admin, render the children (protected admin content)
  return children;
};

export default AdminRoute;
