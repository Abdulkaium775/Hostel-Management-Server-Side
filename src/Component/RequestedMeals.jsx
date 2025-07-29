import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../Api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { AuthContext } from '../Auth/AuthContext';

const ITEMS_PER_PAGE = 10;

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);

  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequestedMeals = async (page = 1) => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const token = await user.getIdToken();
      const { data } = await axiosInstance.get(`/requested-meals/${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: ITEMS_PER_PAGE,
        },
      });

      setRequestedMeals(data.requests);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch requested meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedMeals(currentPage);
  }, [user?.email, currentPage]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this meal request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await axiosInstance.delete(`/meal-requests/${id}`);
      toast.success('Meal request cancelled');
      // Refetch current page after cancellation
      fetchRequestedMeals(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meal request');
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading your requested meals...</p>;
  if (requestedMeals.length === 0)
    return <p className="text-center mt-6 text-gray-600">No requested meals found.</p>;

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

      {/* Pagination Footer */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestedMeals;
