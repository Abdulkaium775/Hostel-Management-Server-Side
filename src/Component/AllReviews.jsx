import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "https://hotel-server-side-beta.vercel.app", // change if needed
});

const AllReviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // items per page

  // Fetch all reviews with pagination
  const fetchAllReviews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/all-reviews?page=${page}&limit=${limit}`);
      const data = res.data;

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews(currentPage);
  }, [currentPage]);

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
        // Remove deleted review from state (without refetch)
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (error) {
        console.error("Delete review error:", error);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 py-8 text-lg">Loading reviews...</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        All Reviews
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
        <table className="min-w-[700px] w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">
                Meal Title
              </th>
              <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">
                Likes
              </th>
              <th className="p-3 border text-left text-sm sm:text-base">
                Review Text
              </th>
              <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">
                Review Count
              </th>
              <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="p-3 border text-sm sm:text-base">{review.mealTitle}</td>
                  <td className="p-3 border text-center text-sm sm:text-base">
                    {review.mealLikes ?? 0}
                  </td>
                  <td className="p-3 border text-sm sm:text-base">
                    {review.comment || "No review text"}
                  </td>
                  <td className="p-3 border text-center text-sm sm:text-base">
                    {review.mealReviewCount ?? 0}
                  </td>
                  <td className="p-3 border text-center space-x-1 sm:space-x-2">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm w-full sm:w-auto"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/meal/${review.mealId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm w-full sm:w-auto"
                      >
                        View Meal
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllReviews;
