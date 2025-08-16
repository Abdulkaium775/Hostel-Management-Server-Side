import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../Api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";

const AllMeals = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("likes");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const totalPages = Math.ceil(total / limit);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/all-meals?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
      );
      setMeals(response.data.meals);
      setTotal(response.data.total);
    } catch (err) {
      setError("Failed to load meals");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeals();
  }, [sortBy, order, page]);

  const handleDelete = async (mealId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#06B6D4",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(`/meals/${mealId}`, {
        headers: { "x-admin-email": user?.email || "" },
      });
      if (res.data.success) {
        Swal.fire("Deleted!", "The meal has been deleted.", "success");
        fetchMeals();
      } else {
        Swal.fire("Error", res.data.message || "Deletion failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to delete meal.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-[#F8FAFC] rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-[#1E293B] text-center mb-8">All Meals</h2>

      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 text-[#1E293B] font-semibold">
        <label className="flex items-center space-x-2">
          <span>Sort by:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="likes">Likes</option>
            <option value="reviewCount">Reviews Count</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <span>Order:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-center text-gray-600 py-8">Loading meals...</p>}
      {error && <p className="text-center text-red-600 py-8 font-semibold">{error}</p>}
      {!loading && meals.length === 0 && (
        <p className="text-center italic text-gray-600 py-8">No meals found.</p>
      )}

      {/* Table / Cards */}
      {!loading && meals.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="w-full min-w-[700px] table-auto border-collapse">
              <thead>
                <tr className="bg-[#4F46E5] text-white select-none">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-center">Likes</th>
                  <th className="px-4 py-3 text-center">Reviews</th>
                  <th className="px-4 py-3 text-center">Rating</th>
                  <th className="px-4 py-3 text-left">Distributor</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, i) => (
                  <tr
                    key={meal._id}
                    className={i % 2 === 0 ? "bg-[#F8FAFC] hover:bg-[#E2E8F0]" : "bg-white hover:bg-[#E2E8F0]"}
                  >
                    <td className="px-4 py-3 text-[#1E293B] font-medium">{meal.title}</td>
                    <td className="px-4 py-3 text-center">{meal.likes}</td>
                    <td className="px-4 py-3 text-center">{meal.reviewCount}</td>
                    <td className="px-4 py-3 text-center">{meal.rating?.toFixed(1) ?? "N/A"}</td>
                    <td className="px-4 py-3 text-[#1E293B]">{meal.distributorName || "N/A"}</td>
                    <td className="px-4 py-3 text-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(meal._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/meal/${meal._id}`)}
                        className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {meals.map((meal) => (
              <div key={meal._id} className="bg-white rounded-xl shadow p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">{meal.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-semibold text-[#1E293B]">Likes:</span> {meal.likes}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E293B]">Reviews:</span> {meal.reviewCount}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E293B]">Rating:</span> {meal.rating?.toFixed(1) ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E293B]">Distributor:</span> {meal.distributorName || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="flex-1 bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          }`}
        >
          Prev
        </button>
        <span className="font-semibold text-[#1E293B]">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            page >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllMeals;
