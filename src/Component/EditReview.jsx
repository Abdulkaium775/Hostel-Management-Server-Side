import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2'; // ✅ import SweetAlert2
import toast from 'react-hot-toast';

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

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

    axiosInstance.put(`/reviews/${id}`, { comment })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your review has been updated successfully.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate('/dashboard/my-reviews'); // ✅ go back after user confirms
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Could not update the review. Please try again.',
        });
      });
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Edit Your Review</h2>
      <form onSubmit={handleUpdate}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="6"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Update your review comment..."
        />
        <button
          type="submit"
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Update Review
        </button>
      </form>
    </div>
  );
};

export default EditReview;
