import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // change if needed
});

const AllReviews = () => {
    const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews with meal info
  const fetchAllReviews = async () => {
    try {
      const res = await axiosInstance.get("/all-reviews");
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Delete review by id
  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
        Swal.fire("Deleted!", "Review has been deleted.", "success");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (error) {
        console.error("Delete review error:", error);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Meal Title</th>
            <th className="p-2 border">Likes</th>
            <th className="p-2 border">Review Text</th>
            <th className="p-2 border">Review Count</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-100">
                <td className="p-2 border">{review.mealTitle}</td>
                <td className="p-2 border">{review.mealLikes ?? 0}</td>
                <td className="p-2 border">{review.comment || "No review text"}</td>
                <td className="p-2 border">{review.mealReviewCount ?? 0}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                  onClick={() => navigate(`/meal/${review.mealId}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View Meal
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllReviews;
