import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

const gradients = [
  'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
  'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
  'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500',
  'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500',
  'bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500',
];

const MealsTabs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const params = { limit: 3 };
        if (activeTab !== 'All') params.category = activeTab;

        const { data } = await axiosInstance.get('/meals', { params });
        setMeals(data.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition duration-300 ${
              activeTab === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal Cards */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading meals...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.length === 0 && (
            <p className="text-center col-span-full text-gray-500">
              No meals available in this category.
            </p>
          )}

          {meals.map((meal, index) => {
            const gradientClass = gradients[index % gradients.length];
            return (
              <div
                key={meal._id}
                className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col ${gradientClass}`}
              >
                <img
                  src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                  alt={meal.title}
                  className="w-full h-44 sm:h-48 md:h-52 object-cover"
                />
                <div className="p-4 sm:p-5 flex flex-col flex-grow text-white">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                    {meal.title}
                  </h2>

                  <p className="mt-1 text-yellow-300 text-sm sm:text-base font-semibold">
                    {Array(Math.round(meal.rating || 0)).fill('★').join('')}
                    {Array(5 - Math.round(meal.rating || 0)).fill('☆').join('')}
                  </p>

                  <p className="text-base sm:text-lg md:text-xl font-bold mt-2">
                    ${meal.price != null ? meal.price.toFixed(2) : '0.00'}
                  </p>

                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="mt-auto mt-4 bg-white bg-opacity-20 hover:bg-opacity-40 text-black py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base"
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
