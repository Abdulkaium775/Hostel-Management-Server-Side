import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-r from-red-50 to-red-100">
      <h2 className="text-4xl md:text-5xl font-extrabold text-red-700 drop-shadow-md">
        Unauthorized Access
      </h2>
      <p className="mt-4 max-w-md text-lg md:text-xl text-gray-700">
        You don't have permission to view this page.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
        aria-label="Go back to homepage"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
