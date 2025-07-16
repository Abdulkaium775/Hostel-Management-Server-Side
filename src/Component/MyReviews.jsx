import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext'; // Adjust path as needed
import axios from 'axios';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews on mount and when user changes
  useEffect(() => {
    if (!user?.email) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/my-reviews/${user.email}`)
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to load your reviews.');
        setLoading(false);
      });
  }, [user?.email]);

  const handleDelete = (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    axios
      .delete(`http://localhost:5000/reviews/${reviewId}`)
      .then(() => {
        toast.success('Review deleted successfully.');
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      })
      .catch(() => {
        toast.error('Failed to delete review.');
      });
  };

  if (loading) {
    return <div className="p-4">Loading your reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="p-4">You have not posted any reviews yet.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-300">Meal Title</th>
              <th className="p-3 border border-gray-300">Likes</th>
              <th className="p-3 border border-gray-300">Review</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(({ _id, mealTitle, likes, comment, mealId }) => (
              <tr key={_id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{mealTitle}</td>
                <td className="p-3 border border-gray-300 text-center">{likes || 0}</td>
                <td className="p-3 border border-gray-300">{comment}</td>
                <td className="p-3 border border-gray-300 space-x-2">
                  <button
                    onClick={() => navigate(`/edit-review/${_id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meals/${mealId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View Meal
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReviews;
