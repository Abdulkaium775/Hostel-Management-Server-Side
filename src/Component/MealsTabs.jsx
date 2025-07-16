import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';


const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

const MealsTabs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/meals', {
          params: { category: activeTab, limit: 3 },
        });
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
            className={`px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition duration-300 ${
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

          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                alt={meal.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 sm:p-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                  {meal.title}
                </h2>
                <p className="mt-2 text-yellow-500 text-sm sm:text-base font-semibold">
                  {Array(Math.round(meal.rating || 0)).fill('★').join('')}
                  {Array(5 - Math.round(meal.rating || 0)).fill('☆').join('')}
                </p>
                <p className="text-lg sm:text-xl font-bold mt-3">
                  ${meal.price != null ? meal.price.toFixed(2) : '0.00'}
                </p>
                <button
                  onClick={() => navigate(`/meal/${meal._id}`)}
                  className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 rounded-md font-semibold transition"
                >
                  Details
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
