import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [meal, setMeal] = useState(null);
  const [likes, setLikes] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [liking, setLiking] = useState(false);

  // User must have subscription Silver, Gold, or Platinum to request meal
  const canRequestMeal = user && ['Silver', 'Gold', 'Platinum'].includes(user.subscriptionLevel);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const mealRes = await axiosInstance.get(`/meals/${id}`);
        setMeal(mealRes.data);
        setLikes(mealRes.data.likes || 0);

        const reviewsRes = await axiosInstance.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch {
        toast.error('Failed to load meal details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleLike() {
    if (!user) {
      toast.error('Please login to like meals.');
      return;
    }
    if (liking) return;
    setLiking(true);
    try {
      await axiosInstance.patch(`/meals/${id}/like`);
      setLikes((prev) => prev + 1);
      toast.success('Thanks for liking!');
    } catch {
      toast.error('Failed to like meal.');
    } finally {
      setLiking(false);
    }
  }

  async function handleRequestMeal() {
    if (!user) {
      toast.error('Please login to request meals.');
      return;
    }
    if (!canRequestMeal) {
      toast.error('Upgrade your subscription to request meals.');
      return;
    }
    if (requesting) return;
    setRequesting(true);
    try {
      await axiosInstance.post('/meal-requests', {
        mealId: id,
        userEmail: user.email,
        userName: user.name,
      });
      toast.success('Meal requested successfully!');
    } catch {
      toast.error('Failed to request meal.');
    } finally {
      setRequesting(false);
    }
  }

  async function handlePostReview() {
    if (!user) {
      toast.error('Please login to post reviews.');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Review cannot be empty.');
      return;
    }
    try {
      await axiosInstance.post('/reviews', {
        mealId: id,
        userEmail: user.email,
        userName: user.name,
        comment: reviewComment.trim(),
      });
      setReviews((prev) => [
        {
          mealId: id,
          userEmail: user.email,
          userName: user.name,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewComment('');
      toast.success('Review posted!');
    } catch {
      toast.error('Failed to post review.');
    }
  }

  if (loading) return <p className="text-center mt-24 text-lg text-gray-600">Loading meal details...</p>;
  if (!meal) return <p className="text-center mt-24 text-lg text-gray-600">Meal not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans text-gray-900">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">{meal.title}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={meal.image}
          alt={meal.title}
          loading="lazy"
          className="md:flex-1 rounded-xl max-h-[400px] w-full object-cover shadow-lg"
        />

        <div className="md:flex-1 space-y-5 text-lg leading-relaxed">
          <p><span className="font-semibold">Distributor:</span> {meal.distributorName || 'N/A'}</p>
          <p><span className="font-semibold">Description:</span><br />{meal.description}</p>
          <p><span className="font-semibold">Ingredients:</span><br />{meal.ingredients}</p>
          <p><span className="font-semibold">Posted:</span> {new Date(meal.postTime || meal.createdAt).toLocaleString()}</p>
          <p><span className="font-semibold">Rating:</span> {meal.rating ?? 'No ratings yet'}</p>

          <div className="mt-8 flex gap-6">
            <button
              onClick={handleLike}
              disabled={liking}
              aria-label="Like meal"
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300
                ${liking ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              👍 Like ({likes})
            </button>

            <button
              onClick={handleRequestMeal}
              disabled={requesting || !canRequestMeal}
              aria-label="Request meal"
              title={
                !user
                  ? 'Login required'
                  : !canRequestMeal
                  ? 'Upgrade your subscription'
                  : undefined
              }
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300
                ${
                  requesting || !canRequestMeal
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              Request Meal
            </button>
          </div>
        </div>
      </div>

      <hr className="my-14 border-gray-300" />

      <section>
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

        {user ? (
          <div className="mb-10 flex flex-col gap-3">
            <textarea
              rows={4}
              maxLength={500}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePostReview}
              disabled={reviewComment.trim() === ''}
              className={`self-start px-5 py-2 rounded-lg font-semibold transition-colors duration-300
                ${
                  reviewComment.trim() === ''
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="italic text-gray-600 mb-8">Please login to post a review.</p>
        )}

        <div className="flex flex-col gap-6">
          {reviews.length === 0 && <p className="text-gray-600">No reviews yet. Be the first!</p>}
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <p className="text-gray-800 font-semibold mb-1">
                {r.userName}{' '}
                <span className="text-gray-500 text-sm font-normal">
                  ({new Date(r.createdAt).toLocaleString()})
                </span>
              </p>
              <p className="text-gray-700 whitespace-pre-wrap">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MealDetails;
