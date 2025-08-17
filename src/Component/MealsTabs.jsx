import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Category Tabs
const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

const MealsTabs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch meals based on category
  useEffect(() => {
    const fetchMeals = async (token = null) => {
      setLoading(true);
      try {
        const params = { limit: 6 }; // fetch more meals for better layout
        if (activeTab !== 'All') params.category = activeTab;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axiosInstance.get('/meals', { params, headers });

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
        fetchMeals();
      }
    });
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-gray-50 min-h-screen mb-10">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition duration-300 ${
              activeTab === cat
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-cyan-400/20 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal Cards */}
      {loading ? (
        <p className="text-center text-gray-700 text-lg">Loading meals...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.length === 0 && (
            <p className="text-center col-span-full text-gray-700 font-medium">
              No meals available in this category.
            </p>
          )}

          {meals.map((meal) => (
            <div
              key={meal._id}
              className="flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer bg-white"
              onClick={() => navigate(`/meal/${meal._id}`)}
            >
              {/* Image */}
              <div className="h-48 sm:h-52 md:h-56 w-full overflow-hidden">
                <img
                  src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow text-gray-900">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                  {meal.title}
                </h2>

                <p className="text-sm sm:text-base mt-2 line-clamp-3 text-gray-600">
                  {meal.description || 'No description available.'}
                </p>

                <p className="font-bold mt-2 text-indigo-600">${meal.price?.toFixed(2) || '0.00'}</p>

                <button
                  className="mt-4 bg-indigo-600 text-white hover:bg-cyan-400 hover:text-gray-900 py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealsTabs;
