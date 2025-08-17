import React from 'react';
import { useNavigate } from 'react-router-dom';

// Sample static meals data
const sampleMeals = [
  {
    _id: '1',
    title: 'Classic Breakfast Combo',
    description: 'Start your day with eggs, toast, and fresh juice.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1572441710901-36c66d03d95b?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500',
  },
  {
    _id: '2',
    title: 'Healthy Green Salad',
    description: 'A mix of fresh greens, avocado, and nuts for energy.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb47?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500',
  },
  {
    _id: '3',
    title: 'Grilled Chicken Lunch',
    description: 'Succulent grilled chicken with vegetables and rice.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1606755962778-3a930a7e0d10?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500',
  },
  {
    _id: '4',
    title: 'Pasta Delight',
    description: 'Creamy pasta with herbs and fresh parmesan.',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1603133872870-d519ad5e184b?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500',
  },
];

const FeaturedProducts = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-gray-50 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
        Featured Meals
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleMeals.map((meal) => (
          <div
            key={meal._id}
            className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer bg-white flex flex-col"
            onClick={() => console.log(`Card clicked: ${meal.title}`)} // Card click placeholder
          >
            {/* Meal Image */}
            <div className="h-40 sm:h-44 w-full overflow-hidden">
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meal Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{meal.title}</h3>
              <p className="text-gray-600 mt-1 text-sm line-clamp-2">{meal.description}</p>
              <p className="font-bold text-indigo-600 mt-2">${meal.price.toFixed(2)}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  console.log(`Clicked See More for ${meal.title}`); // Button placeholder
                }}
                className="mt-auto bg-indigo-600 hover:bg-cyan-400 text-white font-medium py-2 rounded-md text-sm transition"
              >
                See More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
