import { useEffect, useState } from "react";
import Swal from "sweetalert2";


// Floating leaf SVG component
const Leaf = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    width="60"
    height="80"
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 0C40 25 55 50 30 80C5 50 20 25 30 0Z"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
);

const RealTimeRequests = () => {
  const [count, setCount] = useState(0);
  const targetCount = 1523;

  // Counter animation
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(targetCount / (duration / 50));
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        start = targetCount;
        clearInterval(interval);
      }
      setCount(start);
    }, 50);

    return () => clearInterval(interval);
  }, [targetCount]);

  // Cancel button handler with SweetAlert2
  const handleCancel = async () => {
    console.log('handleCancel called');
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this action?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      Swal.fire("Cancelled!", "Your action has been cancelled.", "success");
    }
  };

  return (
    <section className="relative overflow-hidden py-20 text-center mb-8 text-white px-4 bg-gradient-to-r from-teal-800 via-purple-500 to-cyan-600">
      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-30"></div>

      {/* Blurred animated circles */}
      <div
        className="absolute top-12 left-12 w-44 h-44 rounded-full opacity-25 filter blur-3xl animate-float"
        style={{ backgroundColor: "rgba(20, 184, 166, 0.4)", animationDuration: "7s" }}
      />
      <div
        className="absolute bottom-24 right-24 w-72 h-72 rounded-full opacity-15 filter blur-3xl animate-float"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.3)", animationDuration: "9s", animationDelay: "2s" }}
      />

      {/* Floating leaf elements */}
      <Leaf
        className="absolute top-10 right-1/4 animate-float-slow"
        style={{ color: "rgba(79, 209, 197, 0.25)", animationDuration: "12s" }}
      />
      <Leaf
        className="absolute bottom-16 left-1/3 animate-float-slow"
        style={{ color: "rgba(96, 165, 250, 0.2)", animationDuration: "10s", animationDelay: "3s" }}
      />
      <Leaf
        className="absolute top-1/3 left-1/4 animate-float-slow"
        style={{ color: "rgba(52, 211, 153, 0.22)", animationDuration: "14s", animationDelay: "5s" }}
      />
      <Leaf
        className="absolute bottom-28 right-1/3 animate-float-slow"
        style={{ color: "rgba(6, 182, 212, 0.2)", animationDuration: "11s", animationDelay: "1s" }}
      />

      {/* Heading */}
      <h2 className="relative inline-block text-4xl font-extrabold mb-6 after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-cyan-400 after:via-blue-400 after:to-teal-400 after:rounded after:animate-glow">
        Meals Served So Far
      </h2>

      {/* Meal count */}
      <p
        key={count}
        className="text-7xl font-extrabold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg animate-bounce-slow"
      >
        {count.toLocaleString()}
      </p>

      <p className="mt-5 text-xl opacity-80 max-w-xl mx-auto">
        and counting! Join us to enjoy your delicious meal.
      </p>

      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 transition text-white font-medium rounded"
      >
        Cancel Action
      </button>

      {/* Custom CSS */}
      <style>{`
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 6px 2px rgba(79, 209, 197, 0.7);
            }
            50% {
              box-shadow: 0 0 12px 4px rgba(79, 209, 197, 1);
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          @keyframes floatSlow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: floatSlow 10s ease-in-out infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 1.5s ease-in-out;
          }
          .bg-gradient-radial {
            background: radial-gradient(circle at center, rgba(255 255 255 / 0.15), transparent);
          }
        `}</style>
    </section>
  );
};

export default RealTimeRequests;
