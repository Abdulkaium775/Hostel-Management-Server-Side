import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // change if needed
});

const ServeMeals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servingId, setServingId] = useState(null); // For disabling serve button
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10; // items per page

  // Debounce search input (300ms)
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchRequests = async (searchTerm, currentPage) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/serve-meals", {
        params: { search: searchTerm, page: currentPage, limit },
      });
      setRequests(res.data.requests);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error fetching serve meals:", error);
      Swal.fire("Error", "Failed to load requested meals", "error");
    } finally {
      setLoading(false);
    }
  };

  // Wrapped debounced version of fetchRequests
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((searchTerm, currentPage) => {
      fetchRequests(searchTerm, currentPage);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(search, page);
  }, [search, page, debouncedFetch]);

  const handleServe = async (requestId) => {
    const result = await Swal.fire({
      title: "Serve this meal?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, serve it!",
    });

    if (!result.isConfirmed) return;

    try {
      setServingId(requestId);
      await axiosInstance.put(`/serve-meals/${requestId}/serve`);
      Swal.fire("Served!", "Meal request marked as delivered.", "success");
      // Refresh list after serving
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Serve Meals</h2>

      <input
        type="text"
        placeholder="Search by user name or email"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border p-2 mb-4 w-full md:w-1/2"
      />

      {loading ? (
        <p>Loading requested meals...</p>
      ) : requests.length === 0 ? (
        <p>No meal requests found.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Meal Title</th>
                <th className="p-2 border">User Name</th>
                <th className="p-2 border">User Email</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-100">
                  <td className="p-2 border">{req.mealTitle}</td>
                  <td className="p-2 border">{req.userName}</td>
                  <td className="p-2 border">{req.userEmail}</td>
                  <td className="p-2 border capitalize">{req.status}</td>
                  <td className="p-2 border">
                    {req.status !== "delivered" ? (
                      <button
                        onClick={() => handleServe(req._id)}
                        disabled={servingId === req._id}
                        className={`px-3 py-1 rounded text-white ${
                          servingId === req._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {servingId === req._id ? "Serving..." : "Serve"}
                      </button>
                    ) : (
                      <span className="text-gray-500">Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
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
