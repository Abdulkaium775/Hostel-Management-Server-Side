import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({
  title = 'Oops! Page Not Found',
  message = 'The page you are looking for does not exist or an error occurred.',
  showHomeButton = true,
  errorCode = '404',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 px-6">
      {/* Big error code with subtle pulse */}
      <div className="text-primary text-9xl font-extrabold mb-8 select-none animate-pulse drop-shadow-lg">
        {errorCode}
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-darkText mb-4 text-center drop-shadow">
        {title}
      </h1>

      <p className="max-w-xl text-center text-gray-600 text-lg mb-10 px-4 leading-relaxed">
        {message}
      </p>

      {showHomeButton && (
        <div className="flex space-x-6">
          {/* Filled primary button */}
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            Go to Home
          </button>

          {/* Outline secondary button */}
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg shadow-lg hover:bg-secondary hover:text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
