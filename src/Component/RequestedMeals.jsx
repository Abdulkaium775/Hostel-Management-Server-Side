import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../Api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../Auth/AuthContext';

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);
  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchRequestedMeals = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/requested-meals/${user.email}`);
        setRequestedMeals(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch requested meals');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedMeals();
  }, [user?.email]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this meal request?')) return;

    try {
      setDeletingId(id);
      await axiosInstance.delete(`/meal-requests/${id}`);
      toast.success('Meal request cancelled');
      setRequestedMeals((prev) => prev.filter((meal) => meal._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meal request');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading your requested meals...</p>;
  if (requestedMeals.length === 0) return <p className="text-center mt-6">No requested meals found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h2 className="text-2xl font-semibold mb-6">Your Requested Meals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Meal Title</th>
              <th className="py-2 px-4 border">Likes</th>
              <th className="py-2 px-4 border">Reviews</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Requested At</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedMeals.map(({ _id, mealTitle, likes, reviewCount, status, requestedAt }) => (
              <tr key={_id} className="text-center">
                <td className="py-2 px-4 border">{mealTitle}</td>
                <td className="py-2 px-4 border">{likes}</td>
                <td className="py-2 px-4 border">{reviewCount}</td>
                <td className="py-2 px-4 border capitalize">{status}</td>
                <td className="py-2 px-4 border">{new Date(requestedAt).toLocaleString()}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleCancel(_id)}
                    disabled={deletingId === _id}
                    className={`px-3 py-1 rounded text-white ${
                      deletingId === _id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {deletingId === _id ? 'Cancelling...' : 'Cancel'}
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

export default RequestedMeals;