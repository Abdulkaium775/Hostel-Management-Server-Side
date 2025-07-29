import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "https://hotel-server-side-beta.vercel.app", // change to your backend URL
});

const ServeMeals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servingId, setServingId] = useState(null); // to disable serving button while processing
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // debounce helper
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // fetch meal requests from backend
  const fetchRequests = async (searchTerm, currentPage) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/serve-meals", {
        params: { search: searchTerm, page: currentPage, limit },
      });
      setRequests(res.data.requests);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch meal requests:", error);
      Swal.fire("Error", "Failed to load requested meals", "error");
    } finally {
      setLoading(false);
    }
  };

  // debounced fetchRequests so it doesn't flood backend on every keystroke
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((searchTerm, currentPage) => {
      fetchRequests(searchTerm, currentPage);
    }, 300),
    []
  );

  // effect to call API when search or page changes
  useEffect(() => {
    debouncedFetch(search, page);
  }, [search, page, debouncedFetch]);

  // handler for serving a meal request
  const handleServe = async (requestId) => {
    const confirm = await Swal.fire({
      title: "Serve this meal?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, serve it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      setServingId(requestId);
      await axiosInstance.put(`/serve-meals/${requestId}/serve`);
      Swal.fire("Success", "Meal request marked as delivered.", "success");
      fetchRequests(search, page);
    } catch (error) {
      console.error("Error serving meal request:", error);
      Swal.fire("Error", "Failed to update status.", "error");
    } finally {
      setServingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Serve Meals
      </h2>

      <input
        type="text"
        placeholder="Search by user name or email"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border p-2 mb-4 w-full sm:w-1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {loading ? (
        <p className="text-center text-gray-600 py-8 text-lg">Loading requested meals...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-lg">No meal requests found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
            <table className="min-w-[600px] w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">
                    Meal Title
                  </th>
                  <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">
                    User Name
                  </th>
                  <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">
                    User Email
                  </th>
                  <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">
                    Status
                  </th>
                  <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-100 transition-colors duration-150"
                  >
                    <td className="p-3 border text-sm sm:text-base">{req.mealTitle}</td>
                    <td className="p-3 border text-sm sm:text-base">{req.userName}</td>
                    <td className="p-3 border text-sm sm:text-base">{req.userEmail}</td>
                    <td className="p-3 border text-center text-sm sm:text-base capitalize">
                      {req.status}
                    </td>
                    <td className="p-3 border text-center">
                      {req.status !== "delivered" ? (
                        <button
                          onClick={() => handleServe(req._id)}
                          disabled={servingId === req._id}
                          className={`px-4 py-1 rounded text-white text-sm sm:text-base w-full sm:w-auto ${
                            servingId === req._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {servingId === req._id ? "Serving..." : "Serve"}
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm sm:text-base">Delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Prev
            </button>

            <span className="font-semibold text-gray-700 text-center w-full sm:w-auto">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServeMeals;
