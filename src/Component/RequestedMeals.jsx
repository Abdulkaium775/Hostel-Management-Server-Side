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

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading your requested meals...</p>;
  if (requestedMeals.length === 0) return <p className="text-center mt-6 text-gray-600">No requested meals found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Your Requested Meals</h2>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap">Meal Title</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Likes</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Reviews</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap">Requested At</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requestedMeals.map(({ _id, mealTitle, likes, reviewCount, status, requestedAt }) => (
              <tr key={_id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{mealTitle}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">{likes}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">{reviewCount}</td>
                <td className="py-3 px-4 text-center text-sm capitalize text-gray-700">{status}</td>
                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{new Date(requestedAt).toLocaleString()}</td>
                <td className="py-3 px-4 text-center text-sm">
                  <button
                    onClick={() => handleCancel(_id)}
                    disabled={deletingId === _id}
                    className={`inline-block px-3 py-1 rounded text-white transition-colors ${
                      deletingId === _id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
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
