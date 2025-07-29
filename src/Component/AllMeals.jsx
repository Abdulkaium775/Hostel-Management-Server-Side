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
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(`/meals/${mealId}`, {
        headers: {
          "x-admin-email": user?.email || "",
        },
      });

      if (res.data.success) {
        Swal.fire("Deleted!", "The meal has been deleted.", "success");
        fetchMeals();
      } else {
        Swal.fire("Error", res.data.message || "Deletion failed", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete meal.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
        All Meals
      </h2>

      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-8 text-gray-700 font-semibold">
        <label className="flex items-center space-x-2">
          <span className="whitespace-nowrap">Sort by:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="likes">Likes</option>
            <option value="reviewCount">Reviews Count</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <span className="whitespace-nowrap">Order:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {loading && (
        <p className="text-center text-gray-600 py-8">Loading meals...</p>
      )}
      {error && (
        <p className="text-center text-red-600 py-8 font-semibold">{error}</p>
      )}

      {!loading && meals.length === 0 && (
        <p className="text-center italic text-gray-600 py-8">No meals found.</p>
      )}

      {/* Responsive Table or Cards */}
      {!loading && meals.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="w-full min-w-[700px] table-auto border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white select-none">
                  <th className="px-4 py-3 text-left whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Likes</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Reviews Count
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Rating</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Distributor
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, i) => (
                  <tr
                    key={meal._id}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3">{meal.title}</td>
                    <td className="px-4 py-3 text-center">{meal.likes}</td>
                    <td className="px-4 py-3 text-center">{meal.reviewCount}</td>
                    <td className="px-4 py-3 text-center">
                      {meal.rating?.toFixed(1) ?? "N/A"}
                    </td>
                    <td className="px-4 py-3">{meal.distributorName || "N/A"}</td>
                    <td className="px-4 py-3 text-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(meal._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/meal/${meal._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm"
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
              <div
                key={meal._id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">{meal.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-semibold">Likes:</span> {meal.likes}
                  </div>
                  <div>
                    <span className="font-semibold">Reviews:</span> {meal.reviewCount}
                  </div>
                  <div>
                    <span className="font-semibold">Rating:</span>{" "}
                    {meal.rating?.toFixed(1) ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Distributor:</span>{" "}
                    {meal.distributorName || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold"
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
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Prev
        </button>

        <span className="font-semibold text-gray-700 whitespace-nowrap">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllMeals;
