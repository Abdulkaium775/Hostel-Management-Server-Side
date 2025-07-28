import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';
import { getAuth } from "firebase/auth";
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

  const fetchMyReviews = async () => {
    try {
      setLoading(true);

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();

      const res = await axiosInstance.get(`/my-reviews/${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token পাঠাও
        },
      });

      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  fetchMyReviews();
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
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-gray-700">My Reviews</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Meal Title
              </th>
              <th className="p-3 border text-center text-sm font-semibold text-gray-700">Likes</th>
              <th className="p-3 border text-left text-sm font-semibold text-gray-700">Review</th>
              <th className="p-3 border text-center text-sm font-semibold text-gray-700 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map(({ _id, mealTitle, likes = 0, comment, mealId }) => (
              <tr key={_id} className="hover:bg-gray-50">
                <td className="p-3 border text-sm text-gray-900 whitespace-nowrap">{mealTitle}</td>
                <td className="p-3 border text-center text-sm text-gray-700">{likes}</td>
                <td className="p-3 border text-sm text-gray-700 max-w-xs break-words">{comment}</td>
                <td className="p-3 border text-center text-sm space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/dashboard/edit-review/${_id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs md:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${mealId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs md:text-sm"
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
