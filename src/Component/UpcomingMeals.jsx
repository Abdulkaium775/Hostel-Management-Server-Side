import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';
import toast from 'react-hot-toast';

const UpcomingMeals = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [userBadge, setUserBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming meals
  const fetchUpcomingMeals = async () => {
    try {
      const res = await axiosInstance.get('/upcoming-meals');
      setMeals(res.data);
    } catch {
      toast.error('❌ Failed to fetch upcoming meals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user badge
  const fetchUserBadge = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosInstance.get(`/users/${user.email}`);
      if (!res.data) {
        toast.error('⚠️ User not found');
        return;
      }
      setUserBadge(res.data.badge || null);
    } catch {
      toast.error('⚠️ Error fetching user badge');
    }
  };

  // Like a meal
  const handleLike = async (mealId) => {
    if (!user?.email) {
      toast.error('🔐 Please login to like meals');
      return;
    }

    if (!['Silver', 'Gold', 'Platinum'].includes(userBadge)) {
      toast.error('🚫 Only premium users can like meals');
      return;
    }

    try {
      const res = await axiosInstance.patch(`/upcoming-meals/${mealId}/like`, {
        userEmail: user.email,
      });

      if (res.data.success) {
        toast.success('👍 Meal liked!');
        fetchUpcomingMeals(); // Refresh likes
      }
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Failed to like meal';
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchUpcomingMeals();
    fetchUserBadge();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12 text-lg font-medium text-gray-700">Loading upcoming meals...</div>;
  }

  if (!meals.length) {
    return <div className="text-center py-12 text-lg font-medium text-gray-500">No upcoming meals found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-pink-600 drop-shadow-sm">🌟 Upcoming Meals</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {meals.map((meal) => {
          const alreadyLiked = meal.likedBy?.includes(user?.email);

          return (
            <div
              key={meal._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              <img
                src={meal.image}
                alt={meal.title}
                className="h-48 w-full object-cover rounded-t-2xl"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{meal.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">{meal.description}</p>

                <p className="text-sm text-gray-500 mb-1">
                  📅 <span className="font-medium text-gray-700">Publish Date:</span>{' '}
                  {new Date(meal.publishDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  ❤️ <span className="font-medium text-gray-700">Likes:</span> {meal.likes || 0}
                </p>

                {user && userBadge && ['Silver', 'Gold', 'Platinum'].includes(userBadge) ? (
                  <button
                    onClick={() => handleLike(meal._id)}
                    disabled={alreadyLiked}
                    className={`w-full py-2 rounded-xl text-white font-semibold text-center transition ${
                      alreadyLiked
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300'
                    }`}
                  >
                    {alreadyLiked ? 'Liked ❤️' : 'Like ❤️'}
                  </button>
                ) : (
                  <p className="text-xs text-red-500 font-semibold mt-auto text-center">
                    Only premium users can like
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMeals;
