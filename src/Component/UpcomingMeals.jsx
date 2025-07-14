import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../Api/axios';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpcomingMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data } = await axiosInstance.get('/upcoming-meals');
        setMeals(data);
      } catch (err) {
        console.error('Error fetching upcoming meals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleLike = async (mealId) => {
    if (!user) return navigate('/join-us');

    const isPremium = ['Silver', 'Gold', 'Platinum'].includes(user?.badge);
    if (!isPremium) return alert('Only premium users can like meals.');

    try {
      const res = await axiosInstance.patch(`/upcoming-meals/like/${mealId}`, {
        email: user.email,
      });
      if (res.data.success) {
        setMeals((prev) =>
          prev.map((meal) =>
            meal._id === mealId ? { ...meal, likes: meal.likes + 1, likedBy: [...meal.likedBy, user.email] } : meal
          )
        );
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading upcoming meals...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Meals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No upcoming meals available.</p>
        ) : (
          meals.map((meal) => (
            <div key={meal._id} className="bg-white shadow-lg rounded-xl overflow-hidden">
              <img
                src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                alt={meal.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{meal.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{meal.description?.slice(0, 80)}...</p>
                <p className="mt-3 font-semibold text-blue-500">Planned Date: {new Date(meal.date).toLocaleDateString()}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleLike(meal._id)}
                    disabled={meal.likedBy?.includes(user?.email)}
                    className={`px-4 py-2 rounded-md ${
                      meal.likedBy?.includes(user?.email)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    ❤️ Like {meal.likes}
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingMeals;
