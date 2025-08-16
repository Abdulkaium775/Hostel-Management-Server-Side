import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Category Tabs
const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

// Gradient classes for cards using primary & secondary colors
const gradients = [
  'bg-gradient-to-tr from-[#4F46E5]/80 via-[#06B6D4]/40 to-[#4F46E5]/80',
  'bg-gradient-to-tr from-[#06B6D4]/80 via-[#4F46E5]/40 to-[#06B6D4]/80',
  'bg-gradient-to-tr from-[#4F46E5]/60 via-[#06B6D4]/30 to-[#4F46E5]/60',
];

const MealsTabs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch meals based on category
  useEffect(() => {
    const fetchMeals = async (token) => {
      setLoading(true);
      try {
        const params = { limit: 3 };
        if (activeTab !== 'All') params.category = activeTab;

        const { data } = await axiosInstance.get('/meals', {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });

        setMeals(data.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchMeals(token);
      } else {
        console.log("No user logged in, skipping /meals request");
      }
    });
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 min-h-screen bg-[#F8FAFC]">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition duration-300 ${
              activeTab === cat
                ? 'bg-[#4F46E5] text-white shadow-lg'
                : 'bg-white text-[#4F46E5] border border-[#4F46E5] hover:bg-[#06B6D4]/20 hover:text-[#1E293B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal Cards */}
      {loading ? (
        <p className="text-center text-[#1E293B] text-lg">Loading meals...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.length === 0 && (
            <p className="text-center col-span-full text-[#1E293B] font-medium">
              No meals available in this category.
            </p>
          )}

          {meals.map((meal, index) => {
            const gradientClass = gradients[index % gradients.length];
            return (
              <div
                key={meal._id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col ${gradientClass}`}
              >
                <img
                  src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                  alt={meal.title}
                  className="w-full h-44 sm:h-48 md:h-52 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow text-white">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                    {meal.title}
                  </h2>

                  {/* Rating */}
                  <p className="mt-1 text-yellow-300 text-sm sm:text-base font-semibold">
                    {Array(Math.round(meal.rating || 0)).fill('★').join('')}
                    {Array(5 - Math.round(meal.rating || 0)).fill('☆').join('')}
                  </p>

                  {/* Price */}
                  <p className="text-base sm:text-lg md:text-xl font-bold mt-2">
                    ${meal.price != null ? meal.price.toFixed(2) : '0.00'}
                  </p>

                  {/* Details Button */}
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="mt-auto mt-4 bg-white text-[#4F46E5] hover:bg-[#06B6D4] hover:text-white py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MealsTabs;
