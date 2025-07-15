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
        await fetchReviews();
      } catch (err) {
        console.error('Failed to load meal:', err);
        setMeal(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/${id}`);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchMeal();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like');
      return;
    }

    try {
      await axiosInstance.patch(`/meals/${id}/like`);
      setMeal((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      toast.success('Liked!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to like');
    }
  };

  const handleRequest = async () => {
    if (!user) {
      toast.error('Please log in to request');
      return;
    }
    if (!user.badge || user.badge === 'Bronze') {
      toast.error('Upgrade your package to request meals');
      return;
    }

    try {
      const payload = {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName,
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
    if (!user) {
      toast.error('Please log in to post review');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Review cannot be empty');
      return;
    }

    try {
      const payload = {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName,
        comment: reviewText,
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

  if (loading)
    return <p className="text-center mt-10 text-lg font-medium">Loading...</p>;
  if (!meal)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">Meal not found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <img
          src={meal.image || 'https://via.placeholder.com/600x360?text=No+Image'}
          alt={meal.title}
          className="w-full h-64 object-cover rounded"
        />
        <h1 className="text-3xl font-bold mt-4">{meal.title}</h1>
        {meal.distributor && (
          <p className="text-sm text-gray-500 mt-1">Distributed by: {meal.distributor}</p>
        )}
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
                <p className="font-semibold">{rev.userName || 'Anonymous'}</p>
                <p className="text-sm text-gray-600">
                  {new Date(rev.createdAt || rev.time).toLocaleString()}
                </p>
                <p className="mt-2">{rev.comment || rev.review}</p>
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
