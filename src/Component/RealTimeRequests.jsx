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
    <section className="relative overflow-hidden py-16 px-6 sm:px-12 lg:px-20 text-center bg-[#F8FAFC] rounded-2xl shadow-2xl mb-10">
      {/* Background Accents */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#4F46E5] opacity-10 rounded-full animate-float-slow"></div>
      <div className="absolute -bottom-16 -right-1/4 w-72 h-72 bg-[#06B6D4] opacity-10 rounded-full animate-float-slow animation-delay-3000"></div>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[#1E293B] drop-shadow-sm">
        Meals Served So Far
      </h2>

      {/* Animated Counter */}
      <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-2 text-[#4F46E5] animate-bounce-slow drop-shadow-lg">
        {count.toLocaleString()}
      </p>

      <p className="text-[#1E293B] text-lg sm:text-xl mb-8">
        And counting! Join us to enjoy your delicious meal.
      </p>

      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="px-6 py-3 bg-[#06B6D4] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-lg transition text-sm sm:text-base"
      >
        Cancel Action
      </button>

      {/* Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow {
          animation: floatSlow 12s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default RealTimeRequests;
