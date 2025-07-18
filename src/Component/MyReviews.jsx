import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2'; // ✅ import sweetalert2

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosInstance
      .get(`/my-reviews/${user.email}`)
      .then((res) => {
        setReviews(res.data || []);
      })
      .catch(() => {
        toast.error('Failed to load your reviews.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email]);

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/reviews/${reviewId}`)
          .then(() => {
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));

            Swal.fire({
              title: 'Deleted!',
              text: 'Your review has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the review.', 'error');
          });
      }
    });
  };

  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Loading your reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="p-6 text-gray-500 text-center">You haven't posted any reviews yet.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">My Reviews</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Meal Title</th>
              <th className="p-3 border text-center">Likes</th>
              <th className="p-3 border text-left">Review</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(({ _id, mealTitle, likes = 0, comment, mealId }) => (
              <tr key={_id} className="hover:bg-gray-50">
                <td className="p-3 border">{mealTitle}</td>
                <td className="p-3 border text-center">{likes}</td>
                <td className="p-3 border">{comment}</td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-review/${_id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${mealId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
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
