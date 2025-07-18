import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axios';
import toast from 'react-hot-toast';


const RequestedMeals= ({ userEmail }) => {
  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchRequestedMeals = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/requested-meals/${userEmail}`);
        setRequestedMeals(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch requested meals');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedMeals();
  }, [userEmail]);

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

  if (loading) return <p>Loading...</p>;
  if (requestedMeals.length === 0) return <p>No requested meals found.</p>;

  return (
    <table className="requested-meals-table" border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Meal Title</th>
          <th>Likes</th>
          <th>Reviews Count</th>
          <th>Status</th>
          <th>Requested At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {requestedMeals.map(({ _id, mealTitle, likes, reviewCount, status, requestedAt }) => (
          <tr key={_id}>
            <td>{mealTitle}</td>
            <td>{likes}</td>
            <td>{reviewCount}</td>
            <td>{status}</td>
            <td>{new Date(requestedAt).toLocaleString()}</td>
            <td>
              <button
                onClick={() => handleCancel(_id)}
                disabled={deletingId === _id}
                style={{ cursor: deletingId === _id ? 'not-allowed' : 'pointer' }}
              >
                {deletingId === _id ? 'Cancelling...' : 'Cancel'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestedMeals;
