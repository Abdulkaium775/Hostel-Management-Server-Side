import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/reviews/${id}`)
      .then((res) => {
        setComment(res.data.comment || '');
      })
      .catch(() => {
        toast.error('Failed to load review.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setUpdating(true);

    axiosInstance.put(`/reviews/${id}`, { comment })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your review has been updated successfully.',
          confirmButtonColor: '#4F46E5', // Primary color
        }).then(() => {
          navigate('/dashboard/my-reviews');
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Could not update the review. Please try again.',
          confirmButtonColor: '#4F46E5',
        });
      })
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-100">
        <p className="text-darkText text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-darkText text-center">Edit Your Review</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <label className="block text-darkText font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition"
            placeholder="Update your review..."
          />

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            {updating ? 'Updating...' : 'Update Review'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/my-reviews')}
            className="w-full py-3 border border-darkText text-darkText font-semibold rounded-lg hover:bg-neutral-200 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReview;
