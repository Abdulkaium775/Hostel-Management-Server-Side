import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold text-red-600">Unauthorized Access</h2>
      <p className="mt-4 text-lg text-gray-600">You don't have permission to view this page.</p>
      <Link to="/" className="mt-6 inline-block text-blue-600 underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
