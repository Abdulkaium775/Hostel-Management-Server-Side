import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const RealTimeRequests = () => {
  const [count, setCount] = useState(0);
  const targetCount = 1523;

  // Animate counter
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

  // Cancel button with SweetAlert2
  const handleCancel = async () => {
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
    <section className="relative overflow-hidden py-16 px-6 sm:px-12 lg:px-20 text-center bg-[#F8FAFC] rounded-2xl shadow-lg">
      {/* Background Accents */}
      <div
        className="absolute top-0 left-1/2 w-64 h-64 bg-[#4F46E5] opacity-10 rounded-full -translate-x-1/2 animate-float-slow"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="absolute bottom-0 right-1/3 w-48 h-48 bg-[#06B6D4] opacity-10 rounded-full animate-float-slow"
        style={{ animationDuration: "14s", animationDelay: "3s" }}
      />

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[#1E293B]">
        Meals Served So Far
      </h2>

      {/* Animated Counter */}
      <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-2 text-[#4F46E5] animate-bounce-slow">
        {count.toLocaleString()}
      </p>

      <p className="text-[#1E293B] text-lg sm:text-xl mb-6">
        And counting! Join us to enjoy your delicious meal.
      </p>

      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="px-6 py-3 bg-[#06B6D4] hover:bg-[#4F46E5] text-white font-semibold rounded-md transition text-sm sm:text-base"
      >
        Cancel Action
      </button>

      {/* Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow {
          animation: floatSlow 10s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default RealTimeRequests;
