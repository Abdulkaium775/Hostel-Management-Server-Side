import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';
import { getAuth } from "firebase/auth";

const ITEMS_PER_PAGE = 10;

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.email) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const fetchMyReviews = async (page = 1) => {
      try {
        setLoading(true);

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const token = await currentUser.getIdToken();

        const res = await axiosInstance.get(`/my-reviews/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: ITEMS_PER_PAGE },
        });

        setReviews(res.data.reviews || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews(currentPage);
  }, [user?.email, currentPage]);

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5', // Primary
      cancelButtonColor: '#06B6D4', // Secondary
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
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

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <div className="p-6 text-darkText/70 text-center">Loading your reviews...</div>;
  if (reviews.length === 0)
    return <div className="p-6 text-darkText/70 text-center">You haven't posted any reviews yet.</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-darkText text-center md:text-left">My Reviews</h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-neutralBg bg-neutralBg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-neutralBg">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-darkText">Meal Title</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-darkText">Likes</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-darkText">Review</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-darkText">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map(({ _id, mealTitle, likes = 0, comment, mealId }) => (
              <tr key={_id} className="hover:bg-neutralBg/50 transition-colors">
                <td className="py-3 px-4 text-sm text-darkText">{mealTitle}</td>
                <td className="py-3 px-4 text-center text-sm text-darkText/70">{likes}</td>
                <td className="py-3 px-4 text-sm text-darkText/70 max-w-xs break-words">{comment}</td>
                <td className="py-3 px-4 text-center text-sm flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-review/${_id}`)}
                    className="bg-secondary hover:bg-cyan-700 text-white px-3 py-1 rounded text-xs md:text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-primary hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs md:text-sm transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${mealId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs md:text-sm transition"
                  >
                    View Meal
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-neutralBg bg-white text-darkText hover:bg-neutralBg/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <span className="px-3 py-1 rounded border border-neutralBg bg-white text-darkText">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-neutralBg bg-white text-darkText hover:bg-neutralBg/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyReviews;
