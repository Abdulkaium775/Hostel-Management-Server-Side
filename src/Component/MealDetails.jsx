import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

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

  // Fetch meal details and liked state
  useEffect(() => {
    const fetchMeal = async () => {
      setLoadingMeal(true);
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLikeCount(data.likes || 0);
        setLiked(user?.email && data.likedBy?.includes(user.email));
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error?.response?.data?.message || 'Failed to load meal details',
        });
        setMeal(null);
      } finally {
        setLoadingMeal(false);
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
        Swal.fire('Error', 'Failed to load reviews', 'error');
      }
    };
    fetchReviews();
  }, [id]);

  // Check if user already requested
  useEffect(() => {
    if (!user || !meal) return;
    const checkRequested = async () => {
      try {
        const { data } = await axiosInstance.get(`/requested-meals/${user.email}`);
        const alreadyRequested = data.some(req => req.mealTitle === meal.title);
        setRequested(alreadyRequested);
      } catch {
        // optional silent fail
      }
    };
    checkRequested();
  }, [user, meal]);

  const handleLike = async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login to like meals.', 'warning');
    }
    if (liked) {
      return Swal.fire('Already Liked', 'You have already liked this meal.', 'info');
    }

    try {
      await axiosInstance.patch(`/meals/${id}/like`, { userEmail: user.email });
      setLikeCount(prev => prev + 1);
      setLiked(true);
      Swal.fire('Liked!', 'Meal liked successfully.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to like meal.', 'error');
    }
  };

  const handleRequestMeal = async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login to request meals.', 'warning');
    }
    if (!user.badge || user.badge === 'Bronze') {
      return Swal.fire('Upgrade Required', 'Upgrade your package to request meals.', 'info');
    }
    if (requested) {
      return Swal.fire('Already Requested', 'You have already requested this meal.', 'info');
    }

    try {
      setRequesting(true);
      await axiosInstance.post('/meal-requests', {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
      });
      Swal.fire('Success!', 'Meal requested successfully.', 'success');
      setRequested(true);
    } catch {
      Swal.fire('Error', 'Failed to request meal.', 'error');
    } finally {
      setRequesting(false);
    }
  };

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
      Swal.fire('Posted!', 'Your review has been posted.', 'success');

      const { data } = await axiosInstance.get(`/reviews/${id}`);
      setReviews(data);
      setReviewCount(data.length);
    } catch {
      Swal.fire('Error', 'Failed to post review.', 'error');
    } finally {
      setPostingReview(false);
    }
  };

  if (loadingMeal) return <p className="text-center mt-10">Loading meal details...</p>;
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
      <p className="mt-2 text-gray-800">{meal.description || 'No description available.'}</p>
      <p className="mt-2">
        <strong>Ingredients:</strong> {meal.ingredients || 'Not listed'}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        Posted: {new Date(meal.postedAt || meal.createdAt).toLocaleString()}
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
              <p className="font-semibold">{review.userName || review.userEmail}</p>
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
