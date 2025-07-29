import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../Api/axios";
import { AuthContext } from "../Auth/AuthContext";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const UpcomingMeals = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [userBadge, setUserBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming meals with auth token from Firebase
  const fetchUpcomingMeals = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMeals([]);
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await axiosInstance.get("/upcoming-meals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upcoming meals fetched:", res.data); // Debug log here to check data

      setMeals(res.data);
    } catch (error) {
      toast.error("Failed to fetch upcoming meals");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user badge from backend
  const fetchUserBadge = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosInstance.get(`/users/${user.email}`);
      setUserBadge(res.data.badge || null);
    } catch {
      toast.error("Failed to fetch user badge");
      setUserBadge(null);
    }
  };

  // Handle like click for a meal
  const handleLike = async (mealId) => {
    if (!user?.email) {
      toast.error("Please login to like meals");
      return;
    }
    if (!["Silver", "Gold", "Platinum"].includes(userBadge)) {
      toast.error("Only premium users can like meals");
      return;
    }

    const meal = meals.find((m) => m._id === mealId);
    if (!meal) return;

    const alreadyLiked = meal.likedBy?.includes(user.email);
    if (alreadyLiked) {
      toast.error("You already liked this meal");
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("User not authenticated");
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await axiosInstance.patch(
        `/upcoming-meals/${mealId}/like`,
        { userEmail: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Liked the meal!");

        // Update local state
        setMeals((prevMeals) =>
          prevMeals.map((m) =>
            m._id === mealId
              ? {
                  ...m,
                  likes: (m.likes || 0) + 1,
                  likedBy: [...(m.likedBy || []), user.email],
                }
              : m
          )
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to like meal";
      toast.error(msg);
    }
  };

  // Load meals and user badge on mount or when user changes
  useEffect(() => {
    setLoading(true);
    fetchUserBadge();
    fetchUpcomingMeals();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-12 text-lg font-medium text-gray-700">
        Loading upcoming meals...
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-lg font-medium text-gray-500">
        No upcoming meals found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-extrabold text-center mb-12 text-pink-600 drop-shadow-sm">
        🌟 Upcoming Meals
      </h2>

      <p className="text-sm text-gray-600 mb-4 text-center">
        Showing {meals.length} upcoming meal{meals.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
        {meals.map((meal) => {
          const alreadyLiked = meal.likedBy?.includes(user?.email);
          const canLike =
            user &&
            userBadge &&
            ["Silver", "Gold", "Platinum"].includes(userBadge) &&
            !alreadyLiked;

          // Safely parse date
          let formattedDate = "No date";
          if (meal.publishDate) {
            const dateObj = new Date(meal.publishDate);
            if (!isNaN(dateObj)) {
              formattedDate = dateObj.toLocaleDateString();
            }
          }

          return (
            <article
              key={meal._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              aria-label={`Upcoming meal: ${meal.title}`}
            >
              <img
                src={meal.image}
                alt={meal.title || "Upcoming meal"}
                className="h-48 w-full object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 truncate">
                  {meal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
                  {meal.description}
                </p>

                <p className="text-sm text-gray-500 mb-1">
                  📅{" "}
                  <span className="font-medium text-gray-700">Publish Date:</span>{" "}
                  {formattedDate}
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  ❤️ <span className="font-medium text-gray-700">Likes:</span>{" "}
                  {meal.likes || 0}
                </p>

                {user ? (
                  ["Silver", "Gold", "Platinum"].includes(userBadge) ? (
                    <button
                      onClick={() => handleLike(meal._id)}
                      disabled={!canLike}
                      className={`w-full py-2 rounded-xl text-white font-semibold text-center transition ${
                        !canLike
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-black hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300"
                      }`}
                      aria-disabled={!canLike}
                      aria-label={alreadyLiked ? "Already liked" : "Like this meal"}
                    >
                      {alreadyLiked ? "Liked ❤️" : "Like ❤️"}
                    </button>
                  ) : (
                    <p className="text-xs text-red-500 font-semibold mt-auto text-center">
                      Only premium users can like
                    </p>
                  )
                ) : (
                  <p className="text-xs text-red-500 font-semibold mt-auto text-center">
                    Please login to like meals
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMeals;
