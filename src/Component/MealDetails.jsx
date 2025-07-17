import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [loadingMeal, setLoadingMeal] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [postingReview, setPostingReview] = useState(false);

  // Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      setLoadingMeal(true);
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLikeCount(data.likes || 0);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Failed to load meal details'
        );
        console.error('❌ Error fetching meal details:', {
          url: `/meals/${id}`,
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        });
        setMeal(null);
      } finally {
        setLoadingMeal(false);
      }
    };
    fetchMeal();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/${id}`);
        setReviews(data);
        setReviewCount(data.length);
      } catch (error) {
        toast.error('Failed to load reviews');
        console.error('❌ Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [id]);

  // Like handler
  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like meals');
      return;
    }
    if (liked) {
      toast('You already liked this meal');
      return;
    }
    try {
      await axiosInstance.patch(`/meals/${id}/like`);
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      toast.success('Meal liked');
    } catch (error) {
      toast.error('Failed to like meal');
      console.error('❌ Error liking meal:', error);
    }
  };

  // Request meal handler
  const handleRequestMeal = async () => {
    if (!user) {
      toast.error('Please login to request meals');
      return;
    }
    if (!user.badge || user.badge === 'Bronze') {
      toast.error('Upgrade your package to request meals');
      return;
    }
    if (requested) {
      toast('You already requested this meal');
      return;
    }

    try {
      setRequesting(true);
      await axiosInstance.post('/meal-requests', {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
      });
      toast.success('Meal requested successfully');
      setRequested(true);
    } catch (error) {
      toast.error('Failed to request meal');
      console.error('❌ Error requesting meal:', error);
    } finally {
      setRequesting(false);
    }
  };

  // Post review handler
  const handlePostReview = async () => {
    if (!user) {
      toast.error('Please login to post reviews');
      return;
    }
    if (!newReview.trim()) {
      toast.error('Review cannot be empty');
      return;
    }

    try {
      setPostingReview(true);
      await axiosInstance.post('/reviews', {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
        comment: newReview.trim(),
      });
      setNewReview('');
      toast.success('Review posted');

      // Refresh reviews
      const { data } = await axiosInstance.get(`/reviews/${id}`);
      setReviews(data);
      setReviewCount(data.length);
    } catch (error) {
      toast.error('Failed to post review');
      console.error('❌ Error posting review:', error);
    } finally {
      setPostingReview(false);
    }
  };

  if (loadingMeal) return <p className="text-center mt-10">Loading meal details...</p>;
  if (!meal) return <p className="text-center mt-10">Meal not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <img src={meal.image} alt={meal.title} className="w-full h-64 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{meal.title}</h1>
      <p className="text-gray-600 mt-1">Distributor: {meal.distributor || 'Unknown'}</p>
      <p className="mt-2 text-gray-800">{meal.description}</p>
      <p className="mt-2">
        <strong>Ingredients:</strong> {meal.ingredients}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        Posted: {new Date(meal.postedAt || meal.createdAt).toLocaleString()}
      </p>

      {/* Rating */}
      <div className="text-yellow-500 text-lg mt-2">
        {'★'.repeat(Math.round(meal.rating || 0))}
        {'☆'.repeat(5 - Math.round(meal.rating || 0))}
      </div>

      {/* Like and Request buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`px-4 py-2 rounded ${
            liked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          👍 Like ({likeCount})
        </button>
        <button
          onClick={handleRequestMeal}
          disabled={requested || requesting}
          className={`px-4 py-2 rounded ${
            requested || requesting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {requested ? 'Requested' : requesting ? 'Requesting...' : 'Request Meal'}
        </button>
      </div>

      {/* Reviews Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Reviews ({reviewCount})</h2>

        {user ? (
          <div className="mb-4">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-3 border rounded"
              rows={3}
              placeholder="Write your review..."
            />
            <button
              onClick={handlePostReview}
              disabled={postingReview}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {postingReview ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Login to post a review.</p>
        )}

        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((review) => (
            <li key={review._id} className="border p-4 rounded shadow-sm bg-gray-50">
              <p className="font-semibold">{review.userName}</p>
              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
              <p className="mt-2">{review.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MealDetails;
