import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Failed to load meal:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleLike = async () => {
    if (!user) return toast.error('Please log in to like');

    try {
      const { data } = await axiosInstance.patch(`/meals/like/${id}`);
      setMeal((prev) => ({ ...prev, likes: data.likes }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to like');
    }
  };

  const handleRequest = async () => {
    if (!user) return toast.error('Please log in to request');
    if (!user.badge || user.badge === 'Bronze') {
      return toast.error('Upgrade your package to request meals');
    }

    try {
      const payload = {
        mealId: id,
        title: meal.title,
        userEmail: user.email,
        userName: user.displayName,
        status: 'pending',
      };
      await axiosInstance.post('/meal-requests', payload);
      toast.success('Meal request submitted!');
    } catch (err) {
      console.error(err);
      toast.error('Request failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in to post review');
    if (!reviewText.trim()) return;

    try {
      const payload = {
        mealId: id,
        mealTitle: meal.title,
        reviewer: {
          email: user.email,
          name: user.displayName,
        },
        review: reviewText,
        time: new Date(),
      };
      const { data } = await axiosInstance.post('/reviews', payload);
      setReviews((prev) => [data, ...prev]);
      setReviewText('');
      toast.success('Review posted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post review');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!meal) return <p className="text-center mt-10 text-red-600">Meal not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-indigo-600 mb-4 hover:underline">
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <img
          src={meal.image || 'https://via.placeholder.com/600x360?text=No+Image'}
          alt={meal.title}
          className="w-full h-64 object-cover rounded"
        />
        <h1 className="text-3xl font-bold mt-4">{meal.title}</h1>
        <p className="text-indigo-600 mt-2 font-medium">{meal.category}</p>
        <p className="text-gray-700 mt-2">{meal.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          Ingredients: {meal.ingredients?.join(', ') || 'Not available'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Posted on: {new Date(meal.createdAt || Date.now()).toLocaleString()}
        </p>
        <p className="text-xl font-bold mt-4">${meal.price?.toFixed(2)}</p>
        <p className="mt-3 text-yellow-500 text-lg">
          {Array(Math.round(meal.rating || 0)).fill('★').join('')}
          {Array(5 - Math.round(meal.rating || 0)).fill('☆').join('')}
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            👍 Like ({meal.likes || 0})
          </button>
          <button
            onClick={handleRequest}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Request Meal
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews ({reviews.length})</h2>

        <form onSubmit={handleReviewSubmit} className="mb-6">
          <textarea
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded p-3 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Review
          </button>
        </form>

        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((rev, idx) => (
              <li key={idx} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{rev.reviewer?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-600">
                  {new Date(rev.time).toLocaleString()}
                </p>
                <p className="mt-2">{rev.review}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default MealDetails;
