import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);           // List of users
  const [search, setSearch] = useState('');         // Search input
  const [total, setTotal] = useState(0);            // Total matching users count
  const [page, setPage] = useState(1);               // Current page number
  const limit = 5;                                   // Users per page

  // Fetch users from backend with search and pagination params
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users', {
        params: { search, page, limit },
      });
      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      setTotal(typeof res.data.total === 'number' ? res.data.total : 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
      setUsers([]);
      setTotal(0);
    }
  };

  // Fetch users initially and on search/page change
  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  // Handle making a user an admin
  const handleMakeAdmin = async (id) => {
    try {
      const res = await axios.patch(`/users/${id}/make-admin`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers(); // Refresh users list after update
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to make admin');
    }
  };

  const totalPages = total ? Math.ceil(total / limit) : 0;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by username or email"
        value={search}
        onChange={(e) => {
          setPage(1); // Reset page to 1 when search changes
          setSearch(e.target.value);
        }}
        className="border p-2 rounded mb-4 w-full md:w-1/2"
      />

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Subscription</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((user) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2 border">{user.displayName || 'N/A'}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border capitalize">{user.role || 'user'}</td>
                <td className="px-4 py-2 border">{user.badge || 'Bronze'}</td>
                <td className="px-4 py-2 border">
                  {user.role !== 'admin' ? (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">Admin</span>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
