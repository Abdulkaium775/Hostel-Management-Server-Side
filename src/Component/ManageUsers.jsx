import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axios'; // Your configured axios instance
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination states (optional)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch users from server with search and pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/users', {
        params: { search, page, limit },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when search or page changes
  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  // Handle making a user admin
  const makeAdmin = async (id, email) => {
    const confirm = await Swal.fire({
      title: 'Make Admin?',
      text: `Are you sure you want to make ${email} an admin?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/users/${id}/make-admin`);
      if (res.data.success) {
        Swal.fire('Success', 'User is now an admin!', 'success');
        fetchUsers(); // Refresh user list
      } else {
        Swal.fire('Error', res.data.message || 'Could not update user', 'error');
      }
    } catch (err) {
      console.error('Error making admin:', err);
      Swal.fire('Error', 'Could not update user', 'error');
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on new search
        }}
        className="mb-4 px-3 py-2 border rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow border border-gray-200">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border whitespace-nowrap text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-3 py-2 border whitespace-nowrap text-left text-sm font-semibold text-gray-700">Username</th>
                  <th className="px-3 py-2 border whitespace-nowrap text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-3 py-2 border whitespace-nowrap text-left text-sm font-semibold text-gray-700">Subscription</th>
                  <th className="px-3 py-2 border whitespace-nowrap text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-3 py-2 border whitespace-nowrap text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">{(page - 1) * limit + idx + 1}</td>
                      <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">{user.displayName || 'N/A'}</td>
                      <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">{user.badge || 'Bronze'}</td>
                      <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                      <td className="px-3 py-2 border whitespace-nowrap text-center text-sm">
                        {user.role === 'admin' ? (
                          <span className="text-green-600 font-semibold">Admin</span>
                        ) : (
                          <button
                            onClick={() => makeAdmin(user._id, user.email)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-200"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3 text-sm text-gray-700">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Prev
              </button>
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;
