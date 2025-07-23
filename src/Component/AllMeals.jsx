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

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/all-meals?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
      );
      setMeals(response.data.meals);
      setTotal(response.data.total);
    } catch {
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
        fetchMeals(); // Refresh meals after deletion
        Swal.fire("Deleted!", "The meal has been deleted.", "success");
      } else {
        Swal.fire("Error", res.data.message || "Deletion failed", "error");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete meal.",
        "error"
      );
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Meals
      </h2>

      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <label className="flex items-center space-x-2 text-gray-700 font-semibold">
          <span>Sort by:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="likes">Likes</option>
            <option value="reviewCount">Reviews Count</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="flex items-center space-x-2 text-gray-700 font-semibold">
          <span>Order:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-center">Loading meals...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && meals.length === 0 && (
        <p className="text-center italic">No meals found.</p>
      )}

      {!loading && meals.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full table-auto border border-gray-200 bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Likes</th>
                <th className="px-4 py-3 text-center">Reviews Count</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-left">Distributor</th>
                <th className="px-4 py-3 text-center">Actions</th>
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
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/meals/update/${meal._id}`)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Update
                    </button>
                    <button
  onClick={() => handleDelete(meal._id)}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
>
  Delete
</button>
                    <button
                       onClick={() => navigate(`/meal/${meal._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white"
          }`}
        >
          Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <button
          onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          disabled={page * limit >= total}
          className={`px-4 py-2 rounded ${
            page * limit >= total
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllMeals;
