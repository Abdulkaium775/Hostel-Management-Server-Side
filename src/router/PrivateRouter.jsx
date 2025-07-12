import React, { useContext } from 'react';
import { AuthContext } from '../component/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const Privateroute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // ✅ useContext instead of use()
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />; // ✅ wrap state in an object
  }

  return children;
};

export default Privateroute;