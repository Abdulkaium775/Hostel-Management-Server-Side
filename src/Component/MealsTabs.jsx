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
        setMeals(data.meals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.length === 0 && (
            <p className="text-center col-span-full text-gray-500">
              No meals available in this category.
            </p>
          )}

          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={meal.image || 'https://via.placeholder.com/400x240?text=No+Image'}
                alt={meal.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-900 truncate">{meal.title}</h2>
                <p className="mt-2 text-yellow-500 font-semibold">
                  {Array(Math.round(meal.rating || 0)).fill('★').join('')}
                  {Array(5 - Math.round(meal.rating || 0)).fill('☆').join('')}
                </p>
                <p className="text-xl font-bold mt-4">${meal.price != null ? meal.price.toFixed(2) : '0.00'}</p>
                <button
                  onClick={() => navigate(`/meal/${meal._id}`)}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md"
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
