import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-neutralBg">
      <div className="bg-white rounded-xl shadow-lg p-10 md:p-16 max-w-lg text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-sm">
          Unauthorized Access
        </h2>
        <p className="text-darkText/80 text-lg md:text-xl mb-8">
          You don't have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          aria-label="Go back to homepage"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
