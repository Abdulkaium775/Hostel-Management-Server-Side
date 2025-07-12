import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../Auth/AuthContext";

const UpcomingMeals = () => {
  const { user, membershipLevel } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingMealIds, setLikingMealIds] = useState(new Set());

  // Check if user is premium
  const isPremium = ["Silver", "Gold", "Platinum"].includes(membershipLevel) && user;

  useEffect(() => {
    const fetchUpcomingMeals = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/upcoming-meals");
        if (!res.ok) throw new Error("Failed to fetch upcoming meals");
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load upcoming meals");
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingMeals();
  }, []);

  const handleLike = async (mealId) => {
    if (!isPremium) {
      toast.error("Only premium users can like meals.");
      return;
    }
    if (likingMealIds.has(mealId)) return; // Prevent double clicking
    setLikingMealIds((prev) => new Set(prev).add(mealId));

    try {
      const res = await fetch(`/api/upcoming-meals/${mealId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to like meal");

      // Update meal locally
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal._id === mealId
            ? {
                ...meal,
                likesCount: (meal.likesCount || 0) + 1,
                likedByCurrentUser: true,
              }
            : meal
        )
      );
      toast.success("You liked this meal!");
    } catch (error) {
      toast.error(error.message || "Error liking the meal");
    } finally {
      setLikingMealIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mealId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-indigo-600 font-semibold">
        Loading upcoming meals...
      </p>
    );
  }

  if (meals.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600">
        No upcoming meals found.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center md:text-left">
        Upcoming Meals
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={meal.image || "/default-meal.jpg"}
                alt={meal.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3
                className="text-lg font-semibold text-indigo-900 mb-2 truncate"
                title={meal.name}
              >
                {meal.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize mb-2">
                {meal.category}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Planned for:{" "}
                {new Date(meal.plannedDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-indigo-700 font-bold text-lg">
                  ${meal.price?.toFixed(2) || "-"}
                </p>

                {isPremium ? (
                  <button
                    onClick={() =>
                      !meal.likedByCurrentUser && handleLike(meal._id)
                    }
                    disabled={meal.likedByCurrentUser || likingMealIds.has(meal._id)}
                    className={`flex items-center space-x-1 text-sm font-semibold ${
                      meal.likedByCurrentUser
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-indigo-600 hover:text-indigo-800"
                    } transition`}
                    aria-label={
                      meal.likedByCurrentUser
                        ? "You already liked this meal"
                        : "Like this meal"
                    }
                    aria-pressed={meal.likedByCurrentUser}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        meal.likedByCurrentUser ? "fill-current" : "stroke-current"
                      }`}
                      fill={meal.likedByCurrentUser ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{meal.likesCount || 0}</span>
                  </button>
                ) : (
                  <div
                    className="text-gray-400 flex items-center space-x-1 cursor-not-allowed"
                    title="Only premium users can like meals"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{meal.likesCount || 0}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeals;
