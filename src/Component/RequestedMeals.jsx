import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import axiosInstance from '../Api/axios';

const RequestedMeals = ({ userEmail }) => {
  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // Fetch requested meals
  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    axiosInstance.get(`/requested-meals/${userEmail}`)
      .then(res => {
        setRequestedMeals(res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load requested meals');
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  // Cancel meal request handler
  const handleCancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    setCancelLoadingId(id);
    axiosInstance.delete(`/meal-requests/${id}`)
      .then(() => {
        setRequestedMeals(prev => prev.filter(req => req._id !== id));
        toast.success('Request canceled');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to cancel request');
      })
      .finally(() => setCancelLoadingId(null));
  };

  if (loading) return <p>Loading your requested meals...</p>;

  if (requestedMeals.length === 0)
    return <p>You have no requested meals yet.</p>;

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Meal Title</th>
          <th className="border border-gray-300 p-2">Likes</th>
          <th className="border border-gray-300 p-2">Reviews</th>
          <th className="border border-gray-300 p-2">Status</th>
          <th className="border border-gray-300 p-2">Requested At</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {requestedMeals.map(({ _id, mealTitle, likes, reviewCount, status, requestedAt }) => (
          <tr key={_id}>
            <td className="border border-gray-300 p-2">{mealTitle}</td>
            <td className="border border-gray-300 p-2 text-center">{likes || 0}</td>
            <td className="border border-gray-300 p-2 text-center">{reviewCount || 0}</td>
            <td className="border border-gray-300 p-2 text-center">{status}</td>
            <td className="border border-gray-300 p-2 text-center">{new Date(requestedAt).toLocaleString()}</td>
            <td className="border border-gray-300 p-2 text-center">
              <button
                disabled={cancelLoadingId === _id}
                onClick={() => handleCancel(_id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {cancelLoadingId === _id ? 'Cancelling...' : 'Cancel'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestedMeals;
