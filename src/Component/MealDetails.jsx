import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Likes
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // Meal Request
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [postingReview, setPostingReview] = useState(false);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch meal details and like status
  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLikeCount(data.likes || 0);
        setLiked(user?.email && data.likedBy?.includes(user.email));
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch meal details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, user?.email]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/${id}`);
        setReviews(data);
        setReviewCount(data.length);
      } catch {
        Swal.fire('Error', 'Failed to load reviews.', 'error');
      }
    };
    fetchReviews();
  }, [id]);

  // Check if user already requested this meal
  useEffect(() => {
    if (!user) {
      setRequested(false);
      return;
    }
    const checkRequest = async () => {
      try {
        const { data } = await axiosInstance.get(`/requested-meals/${user.email}`);
        const alreadyRequested = data.some(
          (req) => req.mealId === id || (req.mealId?._id === id)
        );
        setRequested(alreadyRequested);
      } catch (error) {
        console.error('Error checking meal request:', error);
      }
    };
    checkRequest();
  }, [user, id]);

  // Handle Like button click
  const handleLike = async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login to like meals.', 'warning');
    }
    if (liked) return;

    try {
      await axiosInstance.patch(`/meals/${id}/like`, { userEmail: user.email });
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      Swal.fire('Liked!', 'You liked the meal.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to like the meal.', 'error');
    }
  };

  // Handle Request Meal button click
  const handleRequestMeal = async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login to request meals.', 'warning');
    }
    try {
      // Get user badge info
      const { data } = await axiosInstance.get(`/users/${user.email}`);

      // Check badge for request permission (badge check added here)
      if (!data.badge || data.badge === 'Bronze') {
        return Swal.fire(
          'Upgrade Required',
          'Only Silver, Gold, or Platinum users can request meals.',
          'info'
        );
      }

      if (requested) {
        return Swal.fire('Already Requested', 'You have already requested this meal.', 'info');
      }

      setRequesting(true);
      await axiosInstance.post('/meal-requests', {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
      });
      setRequested(true);
      Swal.fire('Success!', 'Meal request submitted successfully.', 'success');
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to request meal.', 'error');
    } finally {
      setRequesting(false);
    }
  };

  // Handle posting a new review
  const handlePostReview = async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login to post reviews.', 'warning');
    }
    if (!newReview.trim()) {
      return Swal.fire('Empty Comment', 'Review cannot be empty.', 'error');
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
      Swal.fire('Success!', 'Review posted successfully.', 'success');

      // Refresh reviews after posting
      const { data } = await axiosInstance.get(`/reviews/${id}`);
      setReviews(data);
      setReviewCount(data.length);
    } catch {
      Swal.fire('Error', 'Failed to post review.', 'error');
    } finally {
      setPostingReview(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading meal details...</p>;
  if (!meal) return <p className="text-center mt-10">Meal not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <img
        src={meal.image || 'https://via.placeholder.com/600x400?text=No+Image'}
        alt={meal.title}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-3xl font-bold mt-4">{meal.title}</h1>
      <p className="text-gray-600 mt-1">Distributor: {meal.distributor || 'Unknown'}</p>
      <p className="mt-2">{meal.description || 'No description available.'}</p>
      <p className="mt-2">
        <strong>Ingredients:</strong> {meal.ingredients || 'N/A'}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        Posted: {formatDate(meal.postedAt || meal.createdAt)}
      </p>

      <div className="text-yellow-500 text-lg mt-2">
        {'★'.repeat(Math.round(meal.rating || 0))}
        {'☆'.repeat(5 - Math.round(meal.rating || 0))}
      </div>

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
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
              <p className="mt-2">{review.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MealDetails;
