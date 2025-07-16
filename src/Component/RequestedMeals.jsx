import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RequestedMeals = ({ userEmail }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch requested meals for the user
  const fetchRequestedMeals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/meal-requests/user/${userEmail}`);
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to fetch requested meals');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userEmail) {
      fetchRequestedMeals();
    }
  }, [userEmail]);

  // Cancel request handler
  const cancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this meal request?')) return;

    try {
      await axios.delete(`http://localhost:5000/meal-requests/${requestId}`);
      toast.success('Request cancelled successfully');
      // Refresh list
      fetchRequestedMeals();
    } catch (err) {
      toast.error('Failed to cancel request');
      console.error(err);
    }
  };

  if (loading) return <p>Loading requested meals...</p>;

  if (requests.length === 0) return <p>No requested meals found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Requested Meals</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Reviews Count</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.requestId}>
              <td>{req.mealTitle}</td>
              <td>{req.likes}</td>
              <td>{req.reviewsCount}</td>
              <td>{req.status}</td>
              <td>{new Date(req.requestedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => cancelRequest(req.requestId)} style={{ cursor: 'pointer' }}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedMeals;
